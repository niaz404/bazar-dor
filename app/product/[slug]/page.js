'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getProductByIdOrSlug, getProducts } from '@/lib/api';
import {
  formatBanglaPrice,
  formatBanglaPct,
  formatBanglaUnit,
  toBanglaNumber
} from '@/lib/bangla';
import toast from 'react-hot-toast';
import { Lock, ArrowLeft } from 'lucide-react';

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [prod, allProds] = await Promise.all([
          getProductByIdOrSlug(slug),
          getProducts()
        ]);
        setProduct(prod);
        setAllProducts(allProds || []);
      } catch (err) {
        //
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('পণ্যের বিস্তারিত বাজারদর দেখতে অনুগ্রহ করে সাইন ইন করুন', {
        id: 'auth-toast'
      });
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f8f5]">
        <Navbar tickerProducts={allProducts} />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse space-y-6">
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-28 bg-slate-100 rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-24 bg-slate-100 rounded-2xl" />
              <div className="h-24 bg-slate-100 rounded-2xl" />
              <div className="h-24 bg-slate-100 rounded-2xl" />
            </div>
            <div className="h-64 bg-slate-100 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f8f5]">
        <Navbar tickerProducts={allProducts} />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-50 shadow-md text-center w-full">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">এই পেজটি সুরক্ষিত</h2>
            <p className="text-sm text-slate-600 mb-6">
              পণ্যের বিস্তারিত বাজার বিশ্লেষণ, বাজারভিত্তিক দাম ও মূল্য তালিকা দেখতে সাইন ইন করুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/signin?redirect=/product/${slug}`}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all text-center"
              >
                সাইন ইন করুন
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all text-center"
              >
                হোমে ফিরে যান
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f8f5]">
        <Navbar tickerProducts={allProducts} />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-2">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
            <p className="text-sm text-slate-600 mb-6">অনুসন্ধানকৃত পণ্যটির কোনো তথ্য সংরক্ষিত নেই।</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const markets = product.markets || [];

  let minMarket = null;
  let maxMarket = null;

  if (markets.length > 0) {
    minMarket = [...markets].sort((a, b) => a.min - b.min)[0];
    maxMarket = [...markets].sort((a, b) => b.max - a.max)[0];
  }

  const calculatedMin = minMarket ? minMarket.min : product.today;
  const calculatedMax = maxMarket ? maxMarket.max : product.today;
  const calculatedAvg = product.today;

  const isUp = product.change?.dir === 'up' || (product.change?.pct > 0);
  const isDown = product.change?.dir === 'down' || (product.change?.pct < 0);

  const priceDiff = (product.today || 0) - (product.yesterday || product.today || 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f8f5]">
      <Navbar tickerProducts={allProducts} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <nav className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            হোম
          </Link>
          <span>&gt;</span>
          {product.category ? (
            <Link
              href={`/category/${product.category}`}
              className="hover:text-emerald-700 transition-colors"
            >
              {product.categoryNameBn || product.category}
            </Link>
          ) : (
            <span>পণ্য</span>
          )}
          <span>&gt;</span>
          <span className="text-slate-800 font-semibold">{product.nameBn}</span>
        </nav>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-50/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
              <span>{product.image || product.categoryIcon || '🍚'}</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {product.nameBn}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {formatBanglaUnit(product.unit)} • {product.categoryNameBn || product.category}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium pt-1">
                {priceDiff > 0 ? (
                  <span className="text-emerald-700 font-semibold">
                    গতকালের তুলনায় আজ দাম বেড়েছে + {toBanglaNumber(priceDiff)} টাকা
                  </span>
                ) : priceDiff < 0 ? (
                  <span className="text-rose-700 font-semibold">
                    গতকালের তুলনায় আজ দাম কমেছে - {toBanglaNumber(Math.abs(priceDiff))} টাকা
                  </span>
                ) : (
                  <span>গতকালের তুলনায় আজকের দাম অপরিবর্তিত</span>
                )}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-center min-w-[170px]">
            <span className="text-xs font-semibold text-slate-500 block">আজকের দাম</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 block my-1">
              {toBanglaNumber(product.today)}
            </span>
            <span className="text-xs font-medium text-slate-500 block">
              টাকা / {product.unit === 'kg' ? 'কেজি' : product.unit === 'liter' ? 'লিটার' : 'একক'}
            </span>
            <div className="mt-2">
              <span
                className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
                  isUp
                    ? 'text-emerald-700 bg-emerald-100'
                    : isDown
                    ? 'text-rose-700 bg-rose-100'
                    : 'text-slate-600 bg-slate-200'
                }`}
              >
                {formatBanglaPct(product.change?.pct, product.change?.dir)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-50/80 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#fbfdfc] rounded-2xl p-5 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 block">সর্বনিম্ন দাম</span>
              <div className="text-2xl font-black text-emerald-600 my-1">
                {formatBanglaPrice(calculatedMin)}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {minMarket ? `সবচেয়ে কম: ${minMarket.market}` : 'সবচেয়ে কম বাজার দর'}
              </span>
            </div>

            <div className="bg-[#fbfdfc] rounded-2xl p-5 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 block">সর্বোচ্চ দাম</span>
              <div className="text-2xl font-black text-rose-600 my-1">
                {formatBanglaPrice(calculatedMax)}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {maxMarket ? `সবচেয়ে বেশি: ${maxMarket.market}` : 'সবচেয়ে বেশি বাজার দর'}
              </span>
            </div>

            <div className="bg-[#fbfdfc] rounded-2xl p-5 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 block">গড় দাম</span>
              <div className="text-2xl font-black text-emerald-800 my-1">
                {formatBanglaPrice(calculatedAvg)}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                প্রতি {product.unit === 'kg' ? 'কেজি' : 'একক'}-এর হিসাব
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-50/80 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#f8faf9] border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-4 sm:px-6">বাজার</th>
                  <th className="py-3 px-4 sm:px-6 border-l border-slate-200">বিভাগ</th>
                  <th className="py-3 px-4 sm:px-6 border-l border-slate-200 text-center">সর্বনিম্ন</th>
                  <th className="py-3 px-4 sm:px-6 border-l border-slate-200 text-center">সর্বোচ্চ</th>
                  <th className="py-3 px-4 sm:px-6 border-l border-slate-200 text-center">গড়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {markets.map((m, idx) => {
                  const avgVal = ((m.min + m.max) / 2).toFixed(2);
                  const formattedAvg =
                    avgVal.endsWith('.00')
                      ? `${toBanglaNumber(parseInt(avgVal, 10))} টাকা`
                      : `${toBanglaNumber(avgVal)} টাকা`;

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-emerald-50/30 transition-colors text-slate-800"
                    >
                      <td className="py-3 px-4 sm:px-6 font-semibold">{m.market}</td>
                      <td className="py-3 px-4 sm:px-6 border-l border-slate-200 text-slate-600">
                        {m.division}
                      </td>
                      <td className="py-3 px-4 sm:px-6 border-l border-slate-200 text-center font-bold text-slate-800">
                        {formatBanglaPrice(m.min)}
                      </td>
                      <td className="py-3 px-4 sm:px-6 border-l border-slate-200 text-center font-bold text-slate-800">
                        {formatBanglaPrice(m.max)}
                      </td>
                      <td className="py-3 px-4 sm:px-6 border-l border-slate-200 text-center font-bold text-slate-900">
                        {formattedAvg}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
