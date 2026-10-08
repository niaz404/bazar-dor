import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'ইমেইল ও নাম প্রদান করুন' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ success: true, fallback: true });
    }

    const db = client.db('bazar-dor');
    const users = db.collection('users');

    const cleanEmail = email.toLowerCase().trim();
    await users.updateOne(
      { email: cleanEmail },
      { $set: { name: name.trim(), updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('MongoDB Update User Error:', err);
    return NextResponse.json(
      { error: 'তথ্য আপডেট করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
