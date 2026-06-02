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
    { title: 'New Collection 2024', subtitle: 'Discover the latest trends in men\'s fashion', cta: 'Shop Now', bg: 'from-primary to-primary-light', accent: 'text-secondary' },
    { title: '50% OFF Everything', subtitle: 'Mega sale on jeans, shirts & more', cta: 'Grab Deal', bg: 'from-secondary to-secondary-dark', accent: 'text-accent' },
    { title: 'Summer Arrivals', subtitle: 'Cool & comfortable styles for hot days', cta: 'Explore', bg: 'from-blue-900 to-indigo-900', accent: 'text-accent' },
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
      if ((window as any).__pjcToast) (window as any).__pjcToast('Subscribed successfully!', 'success');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bg} flex items-center transition-all duration-700 ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-lg">
                <h1 className={`text-4xl md:text-6xl font-poppins font-bold text-white leading-tight animate-slide-up`}>
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mt-4">{slide.subtitle}</p>
                <Link
                  href="/shop"
                  className="inline-block mt-8 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-secondary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  {slide.cta} →
                </Link>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[200px] opacity-10 hidden lg:block">
              👖
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Strip */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto gap-4 pb-2 scrollbar-hide">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/shop/${cat.id}`}
                className="flex flex-col items-center gap-2 min-w-[80px] group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all border border-gray-100">
                  {cat.icon}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-secondary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals with Timer */}
      <FlashDealTimer />

      {/* New Arrivals */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary">New Arrivals</h2>
              <p className="text-sm text-gray-500 mt-1">Fresh styles just dropped</p>
            </div>
            <Link href="/shop" className="text-sm font-medium text-secondary hover:text-secondary-dark flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} badge="🆕 New" />
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-accent to-accent-light rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div>
              <span className="text-sm font-bold text-primary/60 uppercase tracking-wider">Deal of the Day</span>
              <h3 className="text-3xl md:text-4xl font-poppins font-bold text-primary mt-2">
                Flat 50% OFF on All Jeans
              </h3>
              <p className="text-primary/70 mt-2">Use code: <span className="font-bold text-primary">PRASAD50</span></p>
              <Link href="/shop/jeans" className="inline-block mt-4 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                Shop Jeans →
              </Link>
            </div>
            <div className="text-8xl mt-6 md:mt-0 opacity-80">👖</div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary">🔥 Trending Now</h2>
              <p className="text-sm text-gray-500 mt-1">Most popular this week</p>
            </div>
            <Link href="/shop" className="text-sm font-medium text-secondary hover:text-secondary-dark flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {trending.map(product => (
              <ProductCard key={product.id} product={product} badge="🔥 Trending" />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary">⭐ Best Sellers</h2>
              <p className="text-sm text-gray-500 mt-1">Top rated by our customers</p>
            </div>
            <Link href="/shop" className="text-sm font-medium text-secondary hover:text-secondary-dark flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} badge="⭐ Best Seller" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary text-center mb-8">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Summer Collection', desc: 'Cool & breezy styles', color: 'from-blue-400 to-blue-600', icon: '☀️' },
              { title: 'Casual Everyday', desc: 'Comfort meets style', color: 'from-green-400 to-green-600', icon: '🌿' },
              { title: 'Party Wear', desc: 'Stand out from the crowd', color: 'from-purple-400 to-purple-600', icon: '🎉' },
            ].map(collection => (
              <Link key={collection.title} href="/shop" className="group">
                <div className={`bg-gradient-to-br ${collection.color} rounded-2xl p-8 h-48 flex flex-col justify-between hover:scale-105 transition-transform shadow-lg`}>
                  <div>
                    <span className="text-3xl">{collection.icon}</span>
                    <h3 className="text-xl font-poppins font-bold text-white mt-2">{collection.title}</h3>
                    <p className="text-sm text-white/80">{collection.desc}</p>
                  </div>
                  <span className="text-sm text-white/90 font-medium group-hover:translate-x-2 transition-transform inline-block">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary text-center mb-2">What Customers Say</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Real reviews from real customers</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map(review => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{review.userName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{review.userName}</p>
                    <p className="text-xs text-gray-400">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white">Stay Updated</h2>
          <p className="text-gray-300 mt-2">Subscribe for exclusive offers, new arrivals & more</p>
          <form onSubmit={handleSubscribe} className="flex gap-3 mt-6 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
            <button type="submit" className="px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-dark transition-colors">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
