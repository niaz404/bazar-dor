'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-emerald-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-sm text-slate-600">
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <span className="text-emerald-700 font-bold">বাজার দর</span>
            <span className="text-slate-400">—</span>
            <span>প্রয়োজনীয় পণ্যের দাম এক নজরে।</span>
          </div>

          <div className="text-xs sm:text-sm text-slate-500 italic">
            “সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।”
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© ২০২৬ বাজার দর — সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-emerald-700 transition-colors">হোম</Link>
            <Link href="/category/chal" className="hover:text-emerald-700 transition-colors">চাল</Link>
            <Link href="/category/sobji" className="hover:text-emerald-700 transition-colors">সবজি</Link>
            <Link href="/category/mach" className="hover:text-emerald-700 transition-colors">মাছ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
