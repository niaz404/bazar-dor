import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ইমেইল ও পাসওয়ার্ড দিন' },
        { status: 400 }
      );
    }

    let client = null;
    try {
      client = await getMongoClient();
    } catch (dbConnectErr) {
      console.error('MongoDB Connect Error in SignIn:', dbConnectErr.message);
      if (dbConnectErr.message?.includes('Authentication failed') || dbConnectErr.code === 8000) {
        return NextResponse.json(
          { error: 'MongoDB Atlas Authentication failed! ডাটাবেজ পাসওয়ার্ড চেক করুন।' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: `ডাটাবেজ কানেকশন ত্রুটি: ${dbConnectErr.message}` },
        { status: 500 }
      );
    }

    if (!client) {
      return NextResponse.json({ success: true, fallback: true });
    }

    const db = client.db('bazar-dor');
    const users = db.collection('users');

    const cleanEmail = email.toLowerCase().trim();
    const user = await users.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image || null
      }
    });
  } catch (err) {
    console.error('MongoDB Sign In Error:', err);
    return NextResponse.json(
      { error: err.message || 'লগইন করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

