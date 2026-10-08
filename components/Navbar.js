'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getBanglaDate, getUserInitials } from '@/lib/bangla';
import { User, LogOut, Edit, Menu, X, ChevronDown } from 'lucide-react';
import PriceTicker from './PriceTicker';

const CATEGORIES = [
  { id: 'chal', slug: 'chal', nameBn: 'চাল', icon: '🍚' },
  { id: 'dal', slug: 'dal', nameBn: 'ডাল', icon: '🫘' },
  { id: 'tel', slug: 'tel', nameBn: 'তেল', icon: '🛢️' },
  { id: 'sobji', slug: 'sobji', nameBn: 'সবজি', icon: '🥬' },
  { id: 'mach', slug: 'mach', nameBn: 'মাছ', icon: '🐟' },
  { id: 'mangsho', slug: 'mangsho', nameBn: 'মাংস', icon: '🍗' },
  { id: 'dim-dui', slug: 'dim-dui', nameBn: 'ডিম-দুধ', icon: '🥛' },
  { id: 'mosla', slug: 'mosla', nameBn: 'মসলা', icon: '🌶️' }
];

export default function Navbar({ tickerProducts = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [banglaDate, setBanglaDate] = useState('');

  useEffect(() => {
    setBanglaDate(getBanglaDate());
  }, []);

  const handleLogout = () => {
    signOut();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-2xl">
              <span className="leading-none">🛒</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                বাজার দর
              </span>
              <span className="text-xs text-slate-500 font-medium">{banglaDate}</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{getUserInitials(user?.name)}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-[#fbfdfc] hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1.5 sm:gap-3 py-2 overflow-x-auto">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span>🏠</span>
              <span>সকল পণ্য</span>
            </Link>

            {CATEGORIES.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-4 gap-2 pb-3 border-b border-slate-100">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium text-center ${
                pathname === '/' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-base">🏠</span>
              <span>সব পণ্য</span>
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium text-center ${
                  pathname === `/category/${cat.slug}` ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded-xl">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{getUserInitials(user?.name)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
                >
                  <User className="w-3.5 h-3.5" /> প্রোফাইল
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> সাইন আউট
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl border border-emerald-600 text-emerald-700 text-sm font-semibold"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <PriceTicker products={tickerProducts} />
    </header>
  );
}
