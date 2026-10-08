import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f4f8f5]">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 sm:py-24 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm text-center w-full">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            ৪০৪
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 mb-3">
            পেজটি খুঁজে পাওয়া যায়নি
          </h1>

          <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
            আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা বর্তমানে পাওয়া যাচ্ছে না।
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
