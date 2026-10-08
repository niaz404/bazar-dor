import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const redirectTarget = state ? decodeURIComponent(state) : '/';

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!code) {
    return NextResponse.redirect(new URL('/signin?error=oauth_cancelled', request.url));
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const redirectUri = `${protocol}://${host}/api/auth/callback/google`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      return NextResponse.redirect(new URL('/signin?error=google_auth_failed', request.url));
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const googleUser = await userRes.json();
    if (!userRes.ok) {
      console.error('Google userinfo fetch error:', googleUser);
      return NextResponse.redirect(new URL('/signin?error=google_user_failed', request.url));
    }

    const authUser = {
      id: googleUser.id || 'usr_' + Date.now(),
      name: googleUser.name || 'Google User',
      email: googleUser.email,
      image: googleUser.picture || null,
      provider: 'google'
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
              provider: 'google',
              lastLogin: new Date()
            }
          },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.error('MongoDB OAuth user save error:', dbErr);
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
            <h2 style="color: #064e3b; margin-bottom: 8px;">Google লগইন সফল হয়েছে!</h2>
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
    console.error('OAuth callback execution error:', error);
    return NextResponse.redirect(new URL('/signin?error=server_error', request.url));
  }
}
