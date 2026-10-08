'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { getBanglaDate } from '@/lib/bangla';

export default function HeroBanner() {
  const [banglaDate, setBanglaDate] = useState('');

  useEffect(() => {
    setBanglaDate(getBanglaDate());
  }, []);

  return (
    <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-3xl border border-emerald-100 p-6 sm:p-10 lg:p-12 mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold">
            <span>আজকের বাজার দর • {banglaDate}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            আজকের বাজারের দাম <span className="text-emerald-700">এক নজরে</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিশ্লেষণ, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক প্ল্যাটফর্মে।
          </p>

          <div className="pt-2">
            <a
              href="#সব-পণ্য"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-sm transition-all"
            >
              <span>সব পণ্য দেখুন</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md flex items-center justify-center p-4">
            <img
              src="/bazar-hero.png"
              alt="বাজার দর"
              className="w-full h-auto object-contain max-h-72"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
