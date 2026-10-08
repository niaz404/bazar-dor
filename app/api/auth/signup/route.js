import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { name, email, password, image } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'সমস্ত তথ্য প্রদান করা আবশ্যক' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে باشد' },
        { status: 400 }
      );
    }

    let client = null;
    try {
      client = await getMongoClient();
    } catch (dbConnectErr) {
      console.error('MongoDB Connect Error in SignUp:', dbConnectErr.message);
      if (dbConnectErr.message?.includes('Authentication failed') || dbConnectErr.code === 8000) {
        return NextResponse.json(
          { error: 'MongoDB Atlas Authentication failed! অনুগ্রহ করে .env ফাইলে সঠিক ডাটাবেজ ইউজারনেম ও পাসওয়ার্ড চেক করুন।' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: `ডাটাবেজ কানেকশন ত্রুটি: ${dbConnectErr.message}` },
        { status: 500 }
      );
    }

    if (!client) {
      return NextResponse.json({
        success: true,
        message: 'Client fallback mode',
        user: {
          id: 'usr_' + Date.now(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          image: image ? image.trim() : null
        }
      });
    }

    const db = client.db('bazar-dor');
    const users = db.collection('users');

    const cleanEmail = email.toLowerCase().trim();
    const existing = await users.findOne({ email: cleanEmail });

    if (existing) {
      return NextResponse.json(
        { error: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে' },
        { status: 409 }
      );
    }

    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      password: password,
      image: image ? image.trim() : null,
      createdAt: new Date()
    };

    const result = await users.insertOne(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        image: newUser.image
      }
    });
  } catch (err) {
    console.error('MongoDB Sign Up Error:', err);
    return NextResponse.json(
      { error: err.message || 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

