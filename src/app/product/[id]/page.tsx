'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const products = useStore((s) => s.products);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);

  const product = products.find(p => p.id === params.id);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'desc' | 'reviews'>('desc');
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 30) + 15);

  const inWishlist = product ? wishlist.includes(product.id) : false;
  const related = product ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5) : [];
  const discount = product ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const wishlistedCount = Math.floor(Math.random() * 300) + 89;

  useEffect(() => {
    const t = setInterval(() => setViewers(v => v + Math.floor(Math.random() * 6) - 3), 12000);
    return () => clearInterval(t);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center"><span className="text-5xl block mb-3">😕</span><p className="text-[#A0A0A0]">Product not found</p><Link href="/shop" className="btn-gold-sm mt-4 inline-block">Back to Shop</Link></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) { if ((window as any).__pjcToast) (window as any).__pjcToast('Please select a size'); return; }
    addToCart({ productId: product.id, name: product.name, price: product.price, size: selectedSize, color: selectedColor || product.colors[0], qty, emoji: product.emoji });
    if ((window as any).__pjcToast) (window as any).__pjcToast('Added to bag ✓');
  };

  const handleBuyNow = () => {
    if (!selectedSize) { if ((window as any).__pjcToast) (window as any).__pjcToast('Please select a size'); return; }
    addToCart({ productId: product.id, name: product.name, price: product.price, size: selectedSize, color: selectedColor || product.colors[0], qty, emoji: product.emoji });
    window.location.href = '/cart';
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#2A2A2A] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] text-[#666]">
          <Link href="/" className="hover:text-[#C9A84C]">Home</Link><span>/</span>
          <Link href="/shop" className="hover:text-[#C9A84C]">Shop</Link><span>/</span>
          <Link href={`/shop/${product.category}`} className="hover:text-[#C9A84C] capitalize">{product.category}</Link><span>/</span>
          <span className="text-[#A0A0A0] truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div>
            <div className="card rounded-xl aspect-square flex items-center justify-center relative">
              <span className="text-[120px] opacity-50">{product.emoji}</span>
              {discount > 0 && <span className="absolute top-4 left-4 badge-sale text-xs px-2 py-1">{discount}% OFF</span>}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 mt-3">
              {[0,1,2,3].map(i => (
                <div key={i} className="card rounded-lg w-16 h-16 flex items-center justify-center cursor-pointer hover:border-[#C9A84C]">
                  <span className="text-2xl opacity-40">{product.emoji}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.2em]">PJC FASHION</p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-[#2ECC71] text-white text-[11px] font-bold px-2 py-0.5 rounded">4.8 ★</span>
                <span className="text-[11px] text-[#A0A0A0]">(124 reviews)</span>
                <span className="text-[11px] text-[#666]">•</span>
                <span className="text-[11px] text-[#A0A0A0]">♡ {wishlistedCount} wishlisted</span>
              </div>
            </div>

            {/* Price */}
            <div className="card rounded-lg p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#C9A84C]">₹{product.price.toLocaleString()}</span>
                {product.mrp > product.price && <span className="text-base text-[#666] line-through">₹{product.mrp.toLocaleString()}</span>}
                {discount > 0 && <span className="text-sm font-bold text-[#2ECC71]">Save {discount}%</span>}
              </div>
              <p className="text-[10px] text-[#666] mt-1">Inclusive of all taxes • Free shipping above ₹999</p>
            </div>

            {/* Size */}
            <div>
              <h4 className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider mb-2">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`w-10 h-10 rounded-md text-xs font-bold border transition-all ${selectedSize === s ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#2A2A2A] text-[#A0A0A0] hover:border-[#C9A84C]'}`}>
                    {s}
                  </button>
                ))}
              </div>
              {product.stock <= 3 && <p className="text-[10px] text-[#E74C3C] font-bold mt-2 animate-urgency">⚡ Only {product.stock} left in stock!</p>}
            </div>

            {/* Color */}
            {product.colors.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider mb-2">Color</h4>
                <div className="flex gap-2">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? 'border-[#C9A84C] scale-110' : 'border-[#2A2A2A]'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h4 className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider mb-2">Quantity</h4>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 card rounded-md flex items-center justify-center text-white hover:border-[#C9A84C]">−</button>
                <span className="text-sm font-bold text-white w-6 text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(10, qty + 1))} className="w-9 h-9 card rounded-md flex items-center justify-center text-white hover:border-[#C9A84C]">+</button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="flex-1 btn-gold-outline py-3">ADD TO CART</button>
              <button onClick={handleBuyNow} className="flex-1 btn-gold py-3">BUY NOW</button>
            </div>

            {/* Wishlist */}
            <button onClick={() => toggleWishlist(product.id)} className={`text-xs font-medium flex items-center gap-1.5 ${inWishlist ? 'text-[#E74C3C]' : 'text-[#A0A0A0] hover:text-[#E74C3C]'} transition-colors`}>
              <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {inWishlist ? 'WISHLISTED ❤️' : '❤ ADD TO WISHLIST'}
            </button>

            {/* Viewers */}
            <p className="text-[11px] text-[#666]">👁 {viewers} people viewing this right now</p>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-2">
              {[{ i: '🚚', t: 'Free Delivery' }, { i: '🔄', t: '7-Day Returns' }, { i: '✅', t: '100% Genuine' }].map(b => (
                <div key={b.t} className="card rounded-md p-2.5 text-center">
                  <span className="text-lg block">{b.i}</span>
                  <span className="text-[9px] text-[#A0A0A0]">{b.t}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="card rounded-lg overflow-hidden">
              <div className="flex border-b border-[#2A2A2A]">
                <button onClick={() => setTab('desc')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${tab === 'desc' ? 'text-[#C9A84C] border-b-2 border-[#C9A84C]' : 'text-[#666]'}`}>Description</button>
                <button onClick={() => setTab('reviews')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${tab === 'reviews' ? 'text-[#C9A84C] border-b-2 border-[#C9A84C]' : 'text-[#666]'}`}>Reviews</button>
              </div>
              <div className="p-4">
                {tab === 'desc' ? (
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">{product.description}</p>
                ) : (
                  <p className="text-xs text-[#666] text-center py-4">No reviews yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related - 5 per row */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="mb-4">
              <p className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-[0.25em]">You May Also Like</p>
              <h2 className="font-display text-lg font-bold text-white mt-0.5">Similar Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
