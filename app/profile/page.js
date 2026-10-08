'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Calendar, Edit3, ShieldCheck, LogOut, ArrowRight, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('প্রোফাইল দেখতে অনুগ্রহ করে সাইন ইন করুন');
      router.push('/signin?redirect=/profile');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">লোড হচ্ছে...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-md space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-100 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 rounded-3xl overflow-hidden bg-emerald-100 border-2 border-emerald-200 shadow-sm flex items-center justify-center text-emerald-800 text-3xl font-black">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0) || 'U'
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>যাচাইকৃত প্রোফাইল</span>
                </div>
              </div>
            </div>

            {/* Challenge C3: Update Information Button navigating to /profile/update */}
            <Link
              href="/profile/update"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>তথ্য পরিবর্তন</span>
            </Link>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 block mb-1">পুরো নাম</span>
              <p className="font-bold text-slate-900 text-base flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>{user.name}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 block mb-1">ইমেইল ঠিকানা</span>
              <p className="font-bold text-slate-900 text-base flex items-center gap-2 truncate">
                <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 block mb-1">অ্যাকাউন্ট আইডি</span>
              <p className="font-mono text-xs text-slate-700 truncate">
                {user.id || 'usr_default'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 block mb-1">সদস্যপদ স্ট্যাটাস</span>
              <p className="font-bold text-emerald-700 text-sm">সক্রিয় সদস্য (Active)</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                signOut();
                router.push('/');
              }}
              className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>সাইন আউট করুন</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 text-sm font-bold transition-colors"
            >
              <span>বাজার দরে যান</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
