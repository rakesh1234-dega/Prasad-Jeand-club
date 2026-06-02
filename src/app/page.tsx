'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import FlashDealTimer from '@/components/FlashDealTimer';
import { products, categories, reviews } from '@/data/products';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');

  const heroSlides = [
    { 
      title: 'FLAT 50% OFF', 
      subtitle: 'On All Premium Jeans', 
      desc: 'Limited period offer. Don\'t miss out!',
      cta: 'SHOP NOW', 
      bg: 'from-slate-900 via-slate-800 to-slate-900',
      highlight: 'text-red-500',
    },
    { 
      title: 'NEW ARRIVALS', 
      subtitle: 'Summer Collection 2024', 
      desc: 'Fresh styles. Premium fabrics. Best prices.',
      cta: 'EXPLORE', 
      bg: 'from-blue-900 via-indigo-900 to-slate-900',
      highlight: 'text-amber-400',
    },
    { 
      title: 'BUY 2 GET 1 FREE', 
      subtitle: 'On T-Shirts & Shirts', 
      desc: 'Use code: PRASAD3',
      cta: 'CLAIM OFFER', 
      bg: 'from-emerald-900 via-teal-900 to-slate-900',
      highlight: 'text-emerald-400',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const newArrivals = products.filter(p => p.isFeatured).slice(0, 8);
  const trending = products.filter(p => p.isTrending).slice(0, 8);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      if ((window as any).__pjcToast) (window as any).__pjcToast('🎉 Subscribed! Check email for 10% off code', 'success');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white page-enter">
      
      {/* MARKETING: Top Banner - Urgency + Free Shipping Threshold */}
      <div className="bg-gray-900 text-white py-2 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-xs md:text-sm">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <strong>FREE DELIVERY</strong> on orders above ₹999
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <strong>7-DAY EASY RETURNS</strong>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <strong>100% GENUINE</strong>
          </span>
        </div>
      </div>

      {/* Hero Banner - Full Width, Professional */}
      <section className="relative h-[420px] md:h-[520px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bg} flex items-center transition-all duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
              <div className="max-w-xl">
                <p className={`text-sm md:text-base font-bold ${slide.highlight} uppercase tracking-widest mb-2`}>
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl md:text-7xl font-poppins font-black text-white leading-none">
                  {slide.title}
                </h1>
                <p className="text-base md:text-lg text-gray-300 mt-4">{slide.desc}</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-gray-900 font-bold text-sm rounded-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  {slide.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-4'}`} />
          ))}
        </div>
      </section>

      {/* MARKETING: Trust Badges Row */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'Orders above ₹999' },
              { icon: '🔄', title: '7-Day Returns', desc: 'No questions asked' },
              { icon: '✅', title: '100% Original', desc: 'Genuine products' },
              { icon: '🔒', title: 'Secure Payments', desc: 'UPI, Cards, COD' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 p-3 rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">{item.title}</p>
                  <p className="text-[10px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Clean Grid */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900">Shop By Category</h2>
            <p className="text-sm text-gray-500 mt-1">Find what you&apos;re looking for</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/shop/${cat.id}`} className="group flex flex-col items-center text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-product group-hover:shadow-product-hover group-hover:-translate-y-1 transition-all border border-gray-100">
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-gray-700 mt-2 group-hover:text-red-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals - Urgency Section */}
      <FlashDealTimer />

      {/* MARKETING: Social Proof Banner */}
      <section className="py-5 bg-amber-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {['R', 'A', 'S', 'V', 'K'].map((letter, i) => (
              <div key={i} className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">
                {letter}
              </div>
            ))}
          </div>
          <p className="text-sm text-amber-800">
            <strong>50,000+</strong> happy customers across India 
            <span className="text-amber-600 ml-1">★★★★★</span>
          </p>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900">New Arrivals</h2>
              <p className="text-sm text-gray-500 mt-1">Fresh drops this week</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
              View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} badge="NEW" />
            ))}
          </div>
        </div>
      </section>

      {/* MARKETING: Deal of the Day - Creates FOMO */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3">
                Deal of the Day
              </span>
              <h3 className="text-3xl md:text-4xl font-poppins font-black text-white">
                FLAT 50% OFF
              </h3>
              <p className="text-white/80 text-lg mt-1">On All Jeans Collection</p>
              <p className="text-white/60 text-sm mt-2">Use code: <span className="font-bold text-white bg-black/20 px-2 py-0.5 rounded">JEANS50</span></p>
              <Link href="/shop/jeans" className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-white text-gray-900 font-bold text-sm rounded-lg hover:bg-gray-100 transition-all shadow-lg">
                SHOP JEANS →
              </Link>
            </div>
            <div className="text-8xl md:text-[120px] opacity-80 relative z-10">👖</div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900">Trending Now 🔥</h2>
              <p className="text-sm text-gray-500 mt-1">Most popular this week</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
              View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {trending.map(product => (
              <ProductCard key={product.id} product={product} badge="🔥 Trending" />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900">Best Sellers ⭐</h2>
              <p className="text-sm text-gray-500 mt-1">Customer favorites</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
              View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} badge="⭐ Best Seller" />
            ))}
          </div>
        </div>
      </section>

      {/* MARKETING: Customer Reviews - Social Proof */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-2">4.8/5 from 50,000+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.slice(0, 3).map(review => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Verified Purchase</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{review.userName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{review.userName}</p>
                    <p className="text-[10px] text-gray-400">Bought 3 days ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETING: Newsletter with Lead Magnet (10% OFF incentive) */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-xs font-bold text-red-400 uppercase tracking-wider mb-4">
            Exclusive Offer
          </span>
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white">Get 10% OFF Your First Order</h2>
          <p className="text-gray-400 mt-2 text-sm">Subscribe & get exclusive deals, new arrivals, and early access to sales</p>
          <form onSubmit={handleSubscribe} className="flex gap-2 mt-6 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              required
            />
            <button type="submit" className="px-6 py-3 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
              GET 10% OFF
            </button>
          </form>
          <p className="text-[10px] text-gray-500 mt-3">No spam. Unsubscribe anytime. Join 50,000+ subscribers.</p>
        </div>
      </section>
    </div>
  );
}
