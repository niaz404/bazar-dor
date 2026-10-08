import React from 'react';

export default function ProductGridSkeleton({ count = 6 }) {
  const items = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-end justify-between">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-100 rounded w-14" />
              <div className="h-5 bg-slate-200 rounded w-24" />
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
