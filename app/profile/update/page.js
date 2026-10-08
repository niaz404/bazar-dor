'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/lib/auth-client';
import { User, ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('প্রোফাইল আপডেট করতে সাইন ইন করুন');
      router.push('/signin?redirect=/profile/update');
    } else if (user) {
      setName(user.name || '');
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || name.trim().length < 2) {
      toast.error('অনুগ্রহ করে সঠিক নাম লিখুন');
      return;
    }

    setIsSubmitting(true);
    try {
      // Execute update via context and BetterAuth client adapter
      await authClient.updateUser({ name: name.trim() });
      const res = await updateUser({ name: name.trim() });

      if (res.success) {
        router.push('/profile');
      }
    } catch (err) {
      toast.error('তথ্য আপডেট করতে ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-md space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                তথ্য পরিবর্তন (Update Information)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                আপনার প্রোফাইলের নাম ও তথ্য আপডেট করুন
              </p>
            </div>
            <Link
              href="/profile"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          {/* Form for Challenge C3 */}
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                পুরো নাম (Name)
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নতুন নাম লিখুন"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                ইমেইল ঠিকানা (পরিবর্তনযোগ্য নয়)
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed opacity-75"
              />
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>তথ্য সংরক্ষণ করুন (Update Information)</span>
                  </>
                )}
              </button>

              <Link
                href="/profile"
                className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors text-center"
              >
                বাতিল
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
