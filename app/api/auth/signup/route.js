import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

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
        { error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ success: true, message: 'Fallback mode' });
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
      { error: 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
