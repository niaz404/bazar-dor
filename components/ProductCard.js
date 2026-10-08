import React from 'react';
import Link from 'next/link';
import { formatBanglaPrice, formatBanglaPct, formatBanglaUnit } from '@/lib/bangla';

export default function ProductCard({ product }) {
  if (!product) return null;

  const isUp = product.change?.dir === 'up' || (product.change?.pct > 0);
  const isDown = product.change?.dir === 'down' || (product.change?.pct < 0);
  const targetSlug = product.slug || product.id;

  return (
    <Link
      href={`/product/${targetSlug}`}
      className="group block bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-xs hover:shadow-lg hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left emoji and title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
            <span>{product.image || product.categoryIcon || '🛒'}</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors line-clamp-1">
              {product.nameBn}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {formatBanglaUnit(product.unit)}
            </p>
          </div>
        </div>
      </div>

      {/* Price row */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex items-end justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">আজকের দাম</span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {formatBanglaPrice(product.today)}
          </span>
        </div>

        {/* Change badge */}
        <div>
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
              isUp
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : isDown
                ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                : 'bg-slate-50 text-slate-600 border-slate-200/80'
            }`}
          >
            {formatBanglaPct(product.change?.pct, product.change?.dir)}
          </span>
        </div>
      </div>
    </Link>
  );
}
