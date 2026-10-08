'use client';

import React from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

export default function SortControl({ value, onChange }) {
  return (
    <div className="relative inline-flex items-center">
      <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs hover:border-emerald-500 transition-colors">
        <ArrowUpDown className="w-4 h-4 text-emerald-600 mr-2" />
        <span className="text-xs sm:text-sm font-semibold text-slate-500 mr-2">সাজান:</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none appearance-none pr-6 cursor-pointer"
        >
          <option value="default">ডিফল্ট</option>
          <option value="price-low-to-high">দাম: কম থেকে বেশি</option>
          <option value="price-high-to-low">দাম: বেশি থেকে কম</option>
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
      </div>
    </div>
  );
}
