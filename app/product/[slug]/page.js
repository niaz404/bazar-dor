'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import {
  ArrowLeft,
  Lock,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Layers,
  MapPin,
  Scale,
  Sparkles,
  Info
} from 'lucide-react';

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('all');

  // Load product data
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
        console.error('Failed to load product', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  // Protected Route Check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('পণ্যের বিস্তারিত বাজারদর দেখতে অনুগ্রহ করে সাইন ইন করুন', {
        id: 'auth-required-toast'
      });
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar tickerProducts={allProducts} />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse space-y-6">
            <div className="h-10 bg-slate-200 rounded-xl w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-28 bg-slate-100 rounded-2xl" />
              <div className="h-28 bg-slate-100 rounded-2xl" />
              <div className="h-28 bg-slate-100 rounded-2xl" />
            </div>
            <div className="h-64 bg-slate-100 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If user is not authenticated -> show protected screen with Sign In prompt
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar tickerProducts={allProducts} />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-lg text-center w-full">
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
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all text-center"
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

  // If product not found
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar tickerProducts={allProducts} />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl p-10 border border-slate-200">
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

  // Calculate market prices summary
  const markets = product.markets || [];
  const minPrices = markets.map((m) => m.min).filter(Boolean);
  const maxPrices = markets.map((m) => m.max).filter(Boolean);

  const calculatedMin = minPrices.length > 0 ? Math.min(...minPrices) : product.today;
  const calculatedMax = maxPrices.length > 0 ? Math.max(...maxPrices) : product.today;
  const calculatedAvg =
    minPrices.length > 0
      ? Math.round((minPrices.reduce((a, b) => a + b, 0) + maxPrices.reduce((a, b) => a + b, 0)) / (minPrices.length + maxPrices.length))
      : product.today;

  // Divisions list
  const divisions = ['all', ...Array.from(new Set(markets.map((m) => m.division).filter(Boolean)))];

  const filteredMarkets =
    selectedDivision === 'all'
      ? markets
      : markets.filter((m) => m.division === selectedDivision);

  const isUp = product.change?.dir === 'up' || (product.change?.pct > 0);
  const isDown = product.change?.dir === 'down' || (product.change?.pct < 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar tickerProducts={allProducts} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>

          {product.category && (
            <Link
              href={`/category/${product.category}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors"
            >
              <span>{product.categoryIcon || '📁'}</span>
              <span>{product.categoryNameBn || product.category}</span>
            </Link>
          )}
        </div>

        {/* 1. Top Summary Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Product Large Emoji Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center text-4xl sm:text-5xl shadow-xs flex-shrink-0">
                <span>{product.image || product.categoryIcon || '🛒'}</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    {product.nameBn}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 text-xs sm:text-sm font-bold px-3 py-1 rounded-full border ${
                      isUp
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isDown
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {formatBanglaPct(product.change?.pct, product.change?.dir)}
                  </span>
                </div>

                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  আজকের জাতীয় বাজার দর ও প্রধান পাইকারি ও খুচরা বাজারের মূল্য বিশ্লেষণ।
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    {formatBanglaUnit(product.unit)}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                    আজকের গড়: {formatBanglaPrice(product.today)}
                  </span>
                </div>
              </div>
            </div>

            {/* Today's Price Big Card */}
            <div className="w-full md:w-auto bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-5 rounded-2xl shadow-md text-center md:text-right min-w-[200px]">
              <span className="text-xs font-medium text-emerald-100 block">আজকের জাতীয় দর</span>
              <span className="text-2xl sm:text-3xl font-black tracking-tight block my-1">
                {formatBanglaPrice(product.today)}
              </span>
              <span className="text-xs text-emerald-100 font-medium">
                {formatBanglaUnit(product.unit)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Price Summary Cards (Min, Avg, Max) */}
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>মূল্য বিশ্লেষণ সারাংশ</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Minimum Price */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:border-emerald-200 transition-colors">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                সর্বনিম্ন দাম
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {formatBanglaPrice(calculatedMin)}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                বিভিন্ন বাজারের সর্বনিম্ন রেকর্ড
              </span>
            </div>

            {/* Average Price */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:border-blue-200 transition-colors">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                গড় বাজার দর
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-blue-600">
                  {formatBanglaPrice(calculatedAvg)}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                সারাদেশের গড় হিসাব
              </span>
            </div>

            {/* Maximum Price */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:border-rose-200 transition-colors">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                সর্বোচ্চ দাম
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-rose-600">
                  {formatBanglaPrice(calculatedMax)}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                বিভিন্ন বাজারের সর্বোচ্চ সীমা
              </span>
            </div>
          </div>
        </div>

        {/* Historical Price Comparison Bar */}
        {(product.yesterday || product.lastWeek || product.lastMonth) && (
          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>পূর্ববর্তী বাজার দর তুলনা</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="bg-white p-3 rounded-xl border border-emerald-100/80">
                <span className="text-xs text-slate-500 block">গতকাল</span>
                <span className="text-base sm:text-lg font-bold text-slate-800">
                  {formatBanglaPrice(product.yesterday || product.today)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100/80">
                <span className="text-xs text-slate-500 block">গত সপ্তাহ</span>
                <span className="text-base sm:text-lg font-bold text-slate-800">
                  {formatBanglaPrice(product.lastWeek || product.today)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100/80">
                <span className="text-xs text-slate-500 block">গত মাস</span>
                <span className="text-base sm:text-lg font-bold text-slate-800">
                  {formatBanglaPrice(product.lastMonth || product.today)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. বাজারভিত্তিক আজকের দাম (Market Breakdown) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>বাজারভিত্তিক আজকের দাম</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                বিভাগ ও বাজার ভেদে পণ্যের মূল্যের তারতম্য
              </p>
            </div>

            {/* Division Filters */}
            {divisions.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {divisions.map((div) => (
                  <button
                    key={div}
                    onClick={() => setSelectedDivision(div)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedDivision === div
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {div === 'all' ? 'সকল বিভাগ' : div}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Markets Grid/Cards */}
          {filteredMarkets.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-6">
              নির্বাচিত বিভাগের জন্য কোনো বাজারের তথ্য পাওয়া যায়নি।
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMarkets.map((marketItem, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{marketItem.market}</span>
                      </h4>
                      <span className="text-xs font-semibold text-slate-500 ml-5 block">
                        বিভাগ: {marketItem.division}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">ন্যূনতম</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {formatBanglaPrice(marketItem.min)}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">সর্বোচ্চ</span>
                      <span className="font-bold text-rose-700 text-sm">
                        {formatBanglaPrice(marketItem.max)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
