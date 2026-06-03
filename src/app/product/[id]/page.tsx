'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { products, reviews } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find(p => p.id === params.id as string);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = product ? isInWishlist(product.id) : false;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
  }, [product]);

  const productReviews = reviews.filter(r => r.productId === product?.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center"><span className="text-5xl block mb-3">😕</span><h2 className="text-lg font-bold text-white">Product not found</h2><Link href="/shop" className="mt-4 inline-block px-5 py-2 gradient-gold text-black text-xs font-bold rounded-lg">Back to Shop</Link></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) { if ((window as any).__pjcToast) (window as any).__pjcToast('Please select a size', 'error'); return; }
    addToCart(product, selectedSize, selectedColor || product.colors[0], quantity);
    if ((window as any).__pjcToast) (window as any).__pjcToast('Added to cart! 🛒', 'success');
  };

  const handleBuyNow = () => {
    if (!selectedSize) { if ((window as any).__pjcToast) (window as any).__pjcToast('Please select a size', 'error'); return; }
    addToCart(product, selectedSize, selectedColor || product.colors[0], quantity);
    window.location.href = '/cart';
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
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
          {/* Image */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
            <div className="aspect-square flex items-center justify-center relative">
              <span className="text-[120px] opacity-40">{product.category === 'jeans' ? '👖' : product.category === 'tshirts' ? '👕' : product.category === 'shirts' ? '👔' : '🧥'}</span>
              {product.discount > 0 && <span className="absolute top-4 left-4 px-3 py-1 bg-[#E74C3C] text-white text-xs font-bold rounded">{product.discount}% OFF</span>}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <p className="text-[10px] text-[#C9A84C] uppercase tracking-[0.2em] font-bold">{product.brand}</p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-[#2ECC71] text-white text-xs font-bold px-2 py-0.5 rounded">{product.rating} ★</span>
                <span className="text-xs text-[#A0A0A0]">{product.reviewsCount} Reviews</span>
                <span className="text-xs text-[#666]">|</span>
                <span className="text-xs text-[#A0A0A0]">❤️ {Math.floor(Math.random() * 500) + 200} wishlisted</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#C9A84C]">₹{product.price.toLocaleString()}</span>
                {product.oldPrice > product.price && <span className="text-lg text-[#666] line-through">₹{product.oldPrice.toLocaleString()}</span>}
                {product.discount > 0 && <span className="text-sm font-bold text-[#2ECC71]">{product.discount}% off</span>}
              </div>
              <p className="text-[10px] text-[#666] mt-1">Inclusive of all taxes • Free shipping above ₹999</p>
            </div>

            {/* Size */}
            <div>
              <h4 className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider mb-2">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`w-10 h-10 rounded-lg text-xs font-bold border transition-all ${selectedSize === s ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#2A2A2A] text-[#A0A0A0] hover:border-[#C9A84C]'}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <h4 className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider mb-2">Color</h4>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? 'border-[#C9A84C] scale-110' : 'border-[#2A2A2A]'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h4 className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider mb-2">Quantity</h4>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-lg border border-[#2A2A2A] text-white flex items-center justify-center hover:border-[#C9A84C]">-</button>
                <span className="text-base font-bold text-white w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-9 h-9 rounded-lg border border-[#2A2A2A] text-white flex items-center justify-center hover:border-[#C9A84C]">+</button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="flex-1 py-3.5 bg-[#1A1A1A] border border-[#C9A84C] text-[#C9A84C] font-bold text-sm rounded-xl hover:bg-[#C9A84C]/10 transition-all">ADD TO CART</button>
              <button onClick={handleBuyNow} className="flex-1 py-3.5 gradient-gold text-black font-bold text-sm rounded-xl hover:opacity-90 transition-all">BUY NOW</button>
              <button onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)} className={`w-12 h-12 rounded-xl border flex items-center justify-center ${inWishlist ? 'bg-red-500/10 border-red-500/30' : 'border-[#2A2A2A] hover:border-[#C9A84C]'}`}>
                <svg className={`w-5 h-5 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-[#A0A0A0]'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3">
              {[{i:'🚚',t:'Free Delivery'},{i:'🔄',t:'7-Day Returns'},{i:'✅',t:'100% Genuine'}].map(b=>(
                <div key={b.t} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-2.5 text-center">
                  <span className="text-lg block">{b.i}</span>
                  <span className="text-[9px] text-[#A0A0A0] font-medium">{b.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description & Reviews Tabs */}
        <div className="mt-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="flex border-b border-[#2A2A2A]">
            {['description', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? 'text-[#C9A84C] border-b-2 border-[#C9A84C]' : 'text-[#666] hover:text-[#A0A0A0]'}`}>
                {tab} {tab === 'reviews' ? `(${productReviews.length})` : ''}
              </button>
            ))}
          </div>
          <div className="p-5">
            {activeTab === 'description' ? (
              <div>
                <p className="text-sm text-[#A0A0A0] leading-relaxed">{product.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {[{l:'Brand',v:product.brand},{l:'Category',v:product.category},{l:'Stock',v:`${product.stock} units`},{l:'Sizes',v:product.sizes.join(', ')}].map(d=>(
                    <div key={d.l} className="bg-[#222] rounded-lg p-3"><p className="text-[9px] text-[#666] uppercase">{d.l}</p><p className="text-xs text-white font-medium mt-0.5 capitalize">{d.v}</p></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">{productReviews.length > 0 ? productReviews.map(r => (
                <div key={r.id} className="border-b border-[#2A2A2A] pb-3 last:border-0">
                  <div className="flex items-center gap-2"><span className="bg-[#2ECC71] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{r.rating}★</span><span className="text-xs font-medium text-white">{r.userName}</span><span className="text-[10px] text-[#666]">{r.createdAt}</span></div>
                  <p className="text-xs text-[#A0A0A0] mt-1.5">{r.comment}</p>
                </div>
              )) : <p className="text-sm text-[#666] text-center py-6">No reviews yet</p>}</div>
            )}
          </div>
        </div>

        {/* Related Products - 5 per row */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <div className="mb-5">
              <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em]">You May Also Like</p>
              <h2 className="font-display text-xl font-bold text-white mt-1">Similar Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
