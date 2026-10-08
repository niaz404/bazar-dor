'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import SortControl from '@/components/SortControl';
import { getCategoryBySlug, getProducts } from '@/lib/api';
import { toBanglaNumber, fromBanglaNumber } from '@/lib/bangla';
import { AlertCircle } from 'lucide-react';

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [category, setCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setIsNotFound(false);

      try {
        const [catData, prodData, allProdData] = await Promise.all([
          getCategoryBySlug(slug),
          getProducts(slug),
          getProducts()
        ]);

        if (!catData && (!prodData || prodData.length === 0)) {
          setIsNotFound(true);
        } else {
          setCategory(catData || { slug, nameBn: slug, icon: '🏷️' });
          setProducts(prodData || []);
          setAllProducts(allProdData || []);
        }
      } catch (err) {
        console.error('Failed to load category', err);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  // Handle Bengali numeric sorting for Challenge C1
  const sortedProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const list = [...products];

    if (sortOption === 'price-low-to-high') {
      return list.sort((a, b) => {
        const priceA = typeof a.today === 'number' ? a.today : fromBanglaNumber(a.today);
        const priceB = typeof b.today === 'number' ? b.today : fromBanglaNumber(b.today);
        return priceA - priceB;
      });
    }

    if (sortOption === 'price-high-to-low') {
      return list.sort((a, b) => {
        const priceA = typeof a.today === 'number' ? a.today : fromBanglaNumber(a.today);
        const priceB = typeof b.today === 'number' ? b.today : fromBanglaNumber(b.today);
        return priceB - priceA;
      });
    }

    return list;
  }, [products, sortOption]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f8f5]">
      <Navbar tickerProducts={allProducts} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-28 bg-white rounded-3xl p-6 border border-slate-100 animate-pulse" />
            <ProductGridSkeleton count={6} />
          </div>
        ) : isNotFound || products.length === 0 ? (
          /* Empty / Invalid Category State */
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200 text-center max-w-xl mx-auto my-12 shadow-xs">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</h2>
            <p className="text-sm text-slate-600 mb-6">
              অনুরোধকৃত ক্যাটাগরিটি বিদ্যমান নেই অথবা এই মুহূর্তে কোনো পণ্য তালিকাভুক্ত নেই।
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
            >
              <span>← হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        ) : (
          /* Normal Category View Matching Screenshot 4 */
          <div className="space-y-6">
            {/* Top Category Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-50/80 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl flex-shrink-0">
                  <span>{category?.icon || '🏷️'}</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {category?.nameBn || category?.name || slug}
                  </h1>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">
                    {toBanglaNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
                  </p>
                </div>
              </div>
            </div>

            {/* Subheader: Item count and Sort control */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                মোট {toBanglaNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
              </p>

              <div className="flex items-center justify-end">
                <SortControl value={sortOption} onChange={setSortOption} />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
