'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { getBanglaDate } from '@/lib/bangla';

export default function HeroBanner() {
  const [banglaDate, setBanglaDate] = useState('শুক্রবার, ৯ অক্টোবর, ২০২৬');

  useEffect(() => {
    setBanglaDate(getBanglaDate());
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 rounded-3xl border border-emerald-100/80 p-6 sm:p-10 lg:p-12 mb-10 shadow-xs">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left text column */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>বাজার দর • {banglaDate}</span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            আজকের বাজারের দাম <span className="text-emerald-700">এক নজরে</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিশ্লেষণ, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক প্ল্যাটফর্মে।
          </p>

          {/* Primary CTA button scrolling to #সব-পণ্য */}
          <div className="pt-2">
            <a
              href="#সব-পণ্য"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>সব পণ্য দেখুন</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>
        </div>

        {/* Right illustration column */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-square flex items-center justify-center p-4">
            <img
              src="/bazar-hero.png"
              alt="বাজার দর ইলুস্ট্রেশন"
              className="w-full h-auto object-contain max-h-72 drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
