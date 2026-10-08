import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const redirectTarget = state ? decodeURIComponent(state) : '/';

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return NextResponse.redirect(new URL('/signin?error=github_cancelled', request.url));
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const redirectUri = `${protocol}://${host}/api/auth/callback/github`;

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('GitHub token exchange error:', tokenData);
      return NextResponse.redirect(new URL('/signin?error=github_auth_failed', request.url));
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'BazarDor-App'
      }
    });

    const githubUser = await userRes.json();

    let userEmail = githubUser.email;
    if (!userEmail) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'BazarDor-App'
        }
      });
      const emails = await emailRes.json();
      if (Array.isArray(emails)) {
        const primary = emails.find((e) => e.primary) || emails[0];
        userEmail = primary?.email;
      }
    }

    const authUser = {
      id: String(githubUser.id) || 'usr_' + Date.now(),
      name: githubUser.name || githubUser.login || 'GitHub User',
      email: userEmail || `${githubUser.login}@github.com`,
      image: githubUser.avatar_url || null,
      provider: 'github'
    };

    // Save/Update in MongoDB users collection
    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db('bazar-dor');
        await db.collection('users').updateOne(
          { email: authUser.email },
          {
            $set: {
              name: authUser.name,
              image: authUser.image,
              provider: 'github',
              lastLogin: new Date()
            }
          },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.error('MongoDB GitHub user save error:', dbErr);
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>লগইন সম্পন্ন হচ্ছে...</title>
          <meta charset="utf-8" />
        </head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f4f8f5;">
          <div style="text-align: center;">
            <h2 style="color: #064e3b; margin-bottom: 8px;">GitHub লগইন সফল হয়েছে!</h2>
            <p style="color: #4b5563;">আপনাকে রিডাইরেক্ট করা হচ্ছে...</p>
          </div>
          <script>
            try {
              localStorage.setItem('bazardor_user', JSON.stringify(${JSON.stringify(authUser)}));
            } catch (e) {
              console.error(e);
            }
            window.location.href = '${redirectTarget}';
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (error) {
    console.error('GitHub OAuth execution error:', error);
    return NextResponse.redirect(new URL('/signin?error=server_error', request.url));
  }
}
