import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { toBanglaNumber } from '@/lib/bangla';
import { TrendingUp, TrendingDown, ShoppingBag } from 'lucide-react';

export default async function HomePage() {
  const allProducts = await getProducts();

  const risers = allProducts
    .filter((p) => p.change?.dir === 'up' || (p.change?.pct > 0))
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  const fallers = allProducts
    .filter((p) => p.change?.dir === 'down' || (p.change?.pct < 0))
    .sort((a, b) => Math.abs(b.change?.pct || 0) - Math.abs(a.change?.pct || 0))
    .slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f8f5]">
      <Navbar tickerProducts={allProducts} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <HeroBanner />

        {risers.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    আজ দাম বেড়েছে <span className="text-emerald-600 text-lg">▲</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    আজকের বাজারে সবচেয়ে বেশি মূলবৃদ্ধির শীর্ষ {toBanglaNumber(risers.length)}টি পণ্য
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {risers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {fallers.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    আজ দাম কমেছে <span className="text-rose-600 text-lg">▼</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    আজকের বাজারে মূল্যহ্রাসের শীর্ষ {toBanglaNumber(fallers.length)}টি পণ্য
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {fallers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <section id="সব-পণ্য" className="scroll-mt-36">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  সব পণ্য
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  মোট {toBanglaNumber(allProducts.length)}টি পণ্য দেখানো হচ্ছে
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
