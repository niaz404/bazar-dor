'use client';

import React from 'react';
import Link from 'next/link';
import { formatBanglaPrice, formatBanglaPct, formatBanglaUnit } from '@/lib/bangla';

export default function PriceTicker({ products = [] }) {
  if (!products || products.length === 0) return null;

  // Duplicate the array to create a seamless infinite loop
  const tickerItems = [...products, ...products];

  return (
    <div className="w-full bg-[#f1f6f3] border-b border-emerald-100 overflow-hidden py-2 text-xs select-none">
      <div className="flex animate-marquee">
        {tickerItems.map((item, idx) => {
          const isUp = item.change?.dir === 'up' || (item.change?.pct > 0);
          const isDown = item.change?.dir === 'down' || (item.change?.pct < 0);

          return (
            <Link
              key={`${item.id}-${idx}`}
              href={`/product/${item.slug || item.id}`}
              className="inline-flex items-center gap-2 mx-5 whitespace-nowrap hover:text-emerald-700 transition-colors font-medium text-slate-700"
            >
              <span className="text-sm">{item.image || item.categoryIcon || '🛒'}</span>
              <span className="font-semibold text-slate-900">{item.nameBn}</span>
              <span className="text-slate-600">
                {formatBanglaPrice(item.today)}/{formatBanglaUnit(item.unit).replace('প্রতি ', '')}
              </span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[11px] inline-flex items-center ${
                  isUp
                    ? 'text-emerald-700 bg-emerald-100/70'
                    : isDown
                    ? 'text-rose-700 bg-rose-100/70'
                    : 'text-slate-600 bg-slate-200/70'
                }`}
              >
                {formatBanglaPct(item.change?.pct, item.change?.dir)}
              </span>
              <span className="text-slate-300 ml-2">•</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
