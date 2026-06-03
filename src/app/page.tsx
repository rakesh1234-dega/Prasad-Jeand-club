'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import FlashTimer from '@/components/FlashTimer';

const categories = [
  { id: 'shirts', name: 'Shirts', emoji: '👔' },
  { id: 'tshirts', name: 'T-Shirts', emoji: '👕' },
  { id: 'jeans', name: 'Jeans', emoji: '👖' },
  { id: 'hoodies', name: 'Hoodies', emoji: '🧥' },
  { id: 'jackets', name: 'Jackets', emoji: '🥼' },
  { id: 'shorts', name: 'Shorts', emoji: '🩳' },
  { id: 'accessories', name: 'Accessories', emoji: '🧤' },
  { id: 'footwear', name: 'Footwear', emoji: '👟' },
];

const reviews = [
  { name: 'Rahul M.', city: 'Mumbai', stars: 5, text: 'Amazing quality! The jeans fit perfectly and the fabric is premium. Will definitely order again.' },
  { name: 'Karthik S.', city: 'Chennai', stars: 5, text: 'Best men\'s fashion store online. Fast delivery, great packaging, and the hoodie exceeded expectations.' },
  { name: 'Priya V.', city: 'Bangalore', stars: 5, text: 'Bought shirts for my husband. He loved them! Quality matches brands 3x the price.' },
];

export default function HomePage() {
  const products = useStore((s) => s.products);
  const coupons = useStore((s) => s.coupons);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Sections from store
  const trending = products.filter(p => p.tags.includes('trending')).slice(0, 5);
  const bestSellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 5);
  const newArrivals = products.filter(p => p.tags.includes('new')).slice(0, 4);
  const topBuying = [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5);
  const activeCoupons = coupons.filter(c => c.active).slice(0, 3);

  // Abandoned cart reminder
  useEffect(() => {
    const abandoned = localStorage.getItem('pjc_cart_abandoned');
    if (abandoned) {
      localStorage.removeItem('pjc_cart_abandoned');
      setTimeout(() => {
        if ((window as any).__pjcToast) (window as any).__pjcToast('🛒 You left items in your cart!');
      }, 2000);
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('pjc_subscribed', email);
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen">
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:h-[420px]">
          {/* Left Panel - 60% */}
          <div className="md:col-span-7 md:row-span-2 card rounded-xl p-8 md:p-10 flex flex-col justify-end relative overflow-hidden min-h-[280px]">
            <div className="absolute top-6 right-6 w-48 h-48 bg-[#C9A84C]/5 rounded-full blur-3xl" />
            <span className="absolute top-1/2 right-8 -translate-y-1/2 text-[140px] opacity-[0.06]">👖</span>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.25em] mb-2">New Collection 2024</p>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-[1.1]">
                Dress to Make<br/>Them <span className="text-[#C9A84C]">Stare.</span>
              </h1>
              <p className="text-[#A0A0A0] text-sm mt-3 max-w-sm">Premium men&apos;s fashion. Handpicked quality. Prices that make sense.</p>
              <Link href="/shop" className="btn-gold inline-flex items-center gap-2 mt-5">
                SHOP THE LOOK <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Top */}
          <Link href="/shop/shirts" className="md:col-span-5 card rounded-xl p-5 flex items-end relative overflow-hidden group min-h-[130px]">
            <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[60px] opacity-20 group-hover:scale-110 transition-transform duration-300">👔</span>
            <div className="relative z-10">
              <p className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest">From ₹999</p>
              <h3 className="font-display text-lg font-bold text-white mt-0.5">Shirts & Formals</h3>
              <span className="text-[10px] text-[#A0A0A0] group-hover:text-[#C9A84C] transition-colors">SHOP NOW →</span>
            </div>
          </Link>

          {/* Right Bottom */}
          <Link href="/shop/jackets" className="md:col-span-5 card rounded-xl p-5 flex items-end relative overflow-hidden group min-h-[130px]">
            <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[60px] opacity-20 group-hover:scale-110 transition-transform duration-300">🥼</span>
            <div className="relative z-10">
              <p className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest">From ₹1999</p>
              <h3 className="font-display text-lg font-bold text-white mt-0.5">Jackets & Hoodies</h3>
              <span className="text-[10px] text-[#A0A0A0] group-hover:text-[#C9A84C] transition-colors">SHOP NOW →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════ FLASH DEAL TIMER ═══════ */}
      <FlashTimer />

      {/* ═══════ CATEGORY CIRCLES ═══════ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-5 md:gap-8 overflow-x-auto pb-2 justify-center flex-wrap">
            {categories.map(cat => (
              <Link key={cat.id} href={`/shop/${cat.id}`} className="group flex flex-col items-center flex-shrink-0">
                <div className="w-[72px] h-[72px] bg-[#1A1A1A] border border-[#2A2A2A] rounded-full flex items-center justify-center text-2xl group-hover:border-[#C9A84C] group-hover:scale-105 transition-all duration-200">
                  {cat.emoji}
                </div>
                <span className="text-[10px] text-[#A0A0A0] mt-2 group-hover:text-[#C9A84C] transition-colors font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ COUPON CODES ═══════ */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="card border-[#C9A84C]/20 rounded-xl p-5">
            <h3 className="font-display text-base font-bold text-white mb-3">Exclusive Discount Codes</h3>
            <div className="flex flex-wrap gap-3">
              {activeCoupons.map(c => (
                <div key={c.code} className="flex items-center gap-2 bg-[rgba(201,168,76,0.08)] border border-[#C9A84C]/20 rounded-lg px-3 py-2">
                  <span className="text-[#C9A84C] font-bold text-xs tracking-wider">{c.code}</span>
                  <span className="text-[#666] text-[10px]">— {c.discount}% off</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TRENDING ═══════ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-[0.25em]">What&apos;s Hot</p>
              <h2 className="font-display text-xl md:text-2xl font-bold text-white mt-0.5">🔥 Trending Now</h2>
            </div>
            <Link href="/shop" className="text-[11px] font-bold text-[#C9A84C] hover:text-[#E8C96A]">VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════ BEST SELLERS ═══════ */}
      <section className="py-8 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-[0.25em]">Customer Favorites</p>
              <h2 className="font-display text-xl md:text-2xl font-bold text-white mt-0.5">⭐ Best Sellers</h2>
            </div>
            <Link href="/shop" className="text-[11px] font-bold text-[#C9A84C] hover:text-[#E8C96A]">VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════ NEW ARRIVALS ═══════ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-[0.25em]">Fresh Drops</p>
              <h2 className="font-display text-xl md:text-2xl font-bold text-white mt-0.5">✨ New Arrivals</h2>
            </div>
            <Link href="/shop" className="text-[11px] font-bold text-[#C9A84C] hover:text-[#E8C96A]">VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════ TOP BUYING ═══════ */}
      <section className="py-8 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-[0.25em]">Most Ordered</p>
              <h2 className="font-display text-xl md:text-2xl font-bold text-white mt-0.5">🏆 Top Buying</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {topBuying.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════ CUSTOMER REVIEWS ═══════ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-[0.25em]">Social Proof</p>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white mt-1">50,000+ Happy Customers</h2>
            <div className="flex items-center justify-center gap-0.5 mt-2">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              <span className="text-[11px] text-[#A0A0A0] ml-2">4.8/5 average</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {reviews.map((r, i) => (
              <div key={i} className="card rounded-xl p-5">
                <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(s => <svg key={s} className={`w-3.5 h-3.5 ${s <= r.stars ? 'text-[#C9A84C]' : 'text-[#333]'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#2A2A2A]">
                  <div className="w-7 h-7 gradient-gold rounded-full flex items-center justify-center"><span className="text-black text-[9px] font-bold">{r.name.charAt(0)}</span></div>
                  <div><p className="text-[11px] font-bold text-white">{r.name}</p><p className="text-[9px] text-[#666]">{r.city} • Verified ✓</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="py-10 bg-[#111] border-t border-[#2A2A2A]">
        <div className="max-w-lg mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 bg-[rgba(201,168,76,0.1)] border border-[#C9A84C]/20 rounded-full text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest mb-3">Exclusive</span>
          <h2 className="font-display text-2xl font-bold text-white">Get 15% Off First Order</h2>
          <p className="text-[#666] text-xs mt-2">Join 50,000+ subscribers for exclusive deals & early access</p>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2 mt-5">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="input flex-1" />
              <button type="submit" className="btn-gold whitespace-nowrap">SUBSCRIBE</button>
            </form>
          ) : (
            <div className="mt-5 p-3 card border-[#C9A84C]/20 rounded-lg">
              <p className="text-xs text-[#2ECC71] font-medium">🎉 Check your email for your code: <span className="text-[#C9A84C] font-bold">FIRST15</span></p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
