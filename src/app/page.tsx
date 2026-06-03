'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import FlashDealTimer from '@/components/FlashDealTimer';
import { products, categories, reviews } from '@/data/products';

export default function HomePage() {
  const [email, setEmail] = useState('');

  // Auto "Top Buying" - most ordered products (simulate from orders)
  const topBuying = [...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5);
  const newArrivals = products.filter(p => p.isFeatured).slice(0, 8);
  const trending = products.filter(p => p.isTrending).slice(0, 10);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 5);

  // Get admin offers from localStorage
  const [adminOffers, setAdminOffers] = useState<any[]>([]);
  useEffect(() => {
    const offers = localStorage.getItem('pjc_admin_offers');
    if (offers) setAdminOffers(JSON.parse(offers).filter((o: any) => o.isActive));
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { if ((window as any).__pjcToast) (window as any).__pjcToast('🎉 Subscribed! Code: FIRST15', 'success'); setEmail(''); }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">

      {/* Announcement Bar */}
      <div className="bg-[#C9A84C] py-2 relative overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-16 text-black text-xs font-bold uppercase tracking-wider">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>⭐ FREE SHIPPING on orders over ₹999</span>
              <span>•</span>
              <span>Use code: FIRST15 for 15% OFF</span>
              <span>•</span>
              <span>7-DAY EASY RETURNS</span>
              <span>•</span>
              <span>100% GENUINE PRODUCTS</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          HERO SECTION - Editorial Grid Layout
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 h-auto md:h-[560px]">
          {/* Primary Hero Card (Left - Large) */}
          <div className="md:col-span-7 md:row-span-2 relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] group cursor-pointer">
            <div className="absolute inset-0 flex items-end p-8 z-10">
              <div>
                <span className="inline-block px-3 py-1 bg-[#C9A84C] text-black text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">New Collection</span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
                  PREMIUM<br/>DENIM<br/><span className="text-[#C9A84C]">COLLECTION</span>
                </h1>
                <p className="text-[#A0A0A0] text-sm mt-3 max-w-xs">Handcrafted quality. Timeless style. Made for the modern man.</p>
                <Link href="/shop/jeans" className="inline-flex items-center gap-2 mt-5 px-6 py-3 gradient-gold text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-all">
                  SHOP NOW <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>
            <div className="absolute top-1/2 right-8 -translate-y-1/2 text-[180px] opacity-20 group-hover:scale-110 transition-transform duration-700">👖</div>
          </div>

          {/* Secondary Stack - Top Right */}
          <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#222] to-[#1A1A1A] border border-[#2A2A2A] group cursor-pointer min-h-[200px]">
            <Link href="/shop/shirts" className="absolute inset-0 flex items-end p-6 z-10">
              <div>
                <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">Up to 50% Off</span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">Shirts & Tees</h3>
              </div>
            </Link>
            <div className="absolute top-1/2 right-6 -translate-y-1/2 text-[80px] opacity-20 group-hover:scale-110 transition-transform duration-500">👔</div>
          </div>

          {/* Secondary Stack - Bottom Right */}
          <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#2A2A2A] group cursor-pointer min-h-[200px]">
            <Link href="/shop/jackets" className="absolute inset-0 flex items-end p-6 z-10">
              <div>
                <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">New Arrivals</span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">Jackets & Hoodies</h3>
              </div>
            </Link>
            <div className="absolute top-1/2 right-6 -translate-y-1/2 text-[80px] opacity-20 group-hover:scale-110 transition-transform duration-500">🧥</div>
          </div>
        </div>

        {/* Lower Feature Row */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="relative rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] p-6 min-h-[160px] group cursor-pointer">
            <Link href="/shop/shorts">
              <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">Summer Ready</span>
              <h3 className="font-display text-xl font-bold text-white mt-1">Shorts Collection</h3>
              <span className="absolute bottom-4 right-6 text-[60px] opacity-20 group-hover:scale-110 transition-transform">🩳</span>
            </Link>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] p-6 min-h-[160px] group cursor-pointer">
            <Link href="/shop/hoodies">
              <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">Best Sellers</span>
              <h3 className="font-display text-xl font-bold text-white mt-1">Hoodies & Layers</h3>
              <span className="absolute bottom-4 right-6 text-[60px] opacity-20 group-hover:scale-110 transition-transform">🧥</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORIES - Circle Buttons (No Border)
      ═══════════════════════════════════════ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em]">Browse</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">Shop By Category</h2>
          </div>
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
            {categories.map(cat => (
              <Link key={cat.id} href={`/shop/${cat.id}`} className="group flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center text-2xl md:text-3xl group-hover:bg-[#C9A84C] group-hover:scale-110 transition-all duration-300">
                  {cat.icon}
                </div>
                <span className="text-[10px] md:text-xs font-medium text-[#A0A0A0] mt-2 group-hover:text-[#C9A84C] transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Offers Section (if offers exist) */}
      {adminOffers.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="gradient-gold rounded-2xl p-6 md:p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <span className="text-xs font-bold text-black/60 uppercase tracking-widest">Limited Time Offer</span>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-black mt-2">{adminOffers[0].title}</h3>
                <p className="text-black/70 mt-2 text-lg font-bold">{adminOffers[0].discountPercent}% OFF</p>
                <Link href="/shop" className="inline-block mt-4 px-8 py-3 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-900">SHOP NOW</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Flash Deals */}
      <FlashDealTimer />

      {/* ═══════════════════════════════════════
          TOP BUYING (Auto - based on most ordered)
      ═══════════════════════════════════════ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em]">Most Purchased</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">Top Buying Products 🏆</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {topBuying.map(product => (
              <ProductCard key={product.id} product={product} badge="🏆 Top" />
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-12 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em]">What&apos;s Hot</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">Trending Now 🔥</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#C9A84C] hover:text-[#E2BC5A] flex items-center gap-1">VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {trending.slice(0, 5).map(product => (
              <ProductCard key={product.id} product={product} badge="🔥" />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em]">Customer Favorites</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">Best Sellers ⭐</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#C9A84C] hover:text-[#E2BC5A] flex items-center gap-1">VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} badge="⭐" />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em]">Fresh Drops</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">New Arrivals ✨</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#C9A84C] hover:text-[#E2BC5A] flex items-center gap-1">VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} badge="NEW" />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Social Proof */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em]">Social Proof</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">50,000+ Happy Customers</h2>
            <div className="flex items-center justify-center gap-0.5 mt-2">{[1,2,3,4,5].map(i=><svg key={i} className="w-4 h-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{reviews.slice(0,3).map(r=>(
            <div key={r.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
              <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i=><svg key={i} className={`w-3.5 h-3.5 ${i<=r.rating?'text-[#C9A84C]':'text-[#333]'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#2A2A2A]">
                <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center"><span className="text-black text-xs font-bold">{r.userName.charAt(0)}</span></div>
                <div><p className="text-xs font-bold text-white">{r.userName}</p><p className="text-[10px] text-[#666]">Verified Buyer ✓</p></div>
              </div>
            </div>
          ))}</div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-[#111] border-t border-[#2A2A2A]">
        <div className="max-w-xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] rounded-full text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider mb-4">Exclusive</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Get 15% Off First Order</h2>
          <p className="text-[#666] text-sm mt-2">Join 50,000+ subscribers for exclusive deals</p>
          <form onSubmit={handleSubscribe} className="flex gap-2 mt-6">
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter email" required className="flex-1 px-4 py-3.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666] text-sm focus:outline-none focus:border-[#C9A84C]" />
            <button type="submit" className="px-6 py-3.5 gradient-gold text-black font-bold text-xs rounded-lg uppercase tracking-wider hover:opacity-90">GET 15% OFF</button>
          </form>
        </div>
      </section>
    </div>
  );
}
