'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('প্রোফাইল দেখতে অনুগ্রহ করে সাইন ইন করুন');
      router.push('/signin?redirect=/profile');
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

    setIsUpdating(true);
    try {
      await authClient.updateUser({ name: name.trim() });
      await updateUser({ name: name.trim() });
    } catch (err) {
      toast.error('তথ্য আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f8f5]">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f8f5]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-50/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex-shrink-0">
              <img
                src={
                  user?.image ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                }
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {user?.name}
              </h2>
              <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
            </div>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-sm transition-colors cursor-pointer"
            >
              <span>↪</span>
              <span>সাইন আউট</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-50/80 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            তথ্য
          </h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                নাম
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম"
                className="w-full px-4 py-3 bg-[#fbfdfc] border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isUpdating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>তথ্য আপডেট করুন</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
