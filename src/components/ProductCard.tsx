'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps { product: Product; badge?: string; }

export default function ProductCard({ product, badge }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const isLowStock = product.stock <= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
    if ((window as any).__pjcToast) (window as any).__pjcToast('Added to cart! 🛒', 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (inWishlist) { removeFromWishlist(product.id); }
    else { addToWishlist(product); if ((window as any).__pjcToast) (window as any).__pjcToast('Added to wishlist ❤️', 'success'); }
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden hover:border-[#C9A84C]/30 transition-all duration-300 hover:-translate-y-1">
        
        {/* Image - 3:4 Aspect Ratio (75% height) */}
        <div className="relative aspect-[3/4] bg-gradient-to-b from-[#222] to-[#1A1A1A] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl opacity-40 group-hover:scale-110 transition-transform duration-500">
            {product.category === 'jeans' ? '👖' : product.category === 'tshirts' ? '👕' : product.category === 'shirts' ? '👔' : product.category === 'hoodies' || product.category === 'jackets' ? '🧥' : '🩳'}
          </div>

          {/* Badges */}
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#E74C3C] text-white text-[10px] font-bold rounded">{product.discount}% OFF</span>
          )}
          {badge && (
            <span className="absolute top-2 right-9 z-10 px-1.5 py-0.5 bg-[#C9A84C] text-black text-[9px] font-bold rounded">{badge}</span>
          )}

          {/* Wishlist */}
          <button onClick={handleWishlist} className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className={`w-3.5 h-3.5 ${inWishlist ? 'text-[#E74C3C] fill-[#E74C3C]' : 'text-white'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>

          {/* Low Stock */}
          {isLowStock && (
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <div className="bg-[#E74C3C]/90 rounded px-2 py-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-urgency"></span>
                <span className="text-[9px] font-bold text-white">Only {product.stock} left!</span>
              </div>
            </div>
          )}

          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button onClick={handleAddToCart} className="w-full py-2.5 gradient-gold text-black text-[10px] font-bold uppercase tracking-wider rounded-lg">ADD TO BAG</button>
          </div>
        </div>

        {/* Info Footer (25% height) - Title Left / Price Right */}
        <div className="p-3 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-[#666] uppercase tracking-widest">{product.brand}</p>
            <h3 className="text-xs font-medium text-white line-clamp-1 mt-0.5 group-hover:text-[#C9A84C] transition-colors">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="bg-[#2ECC71] text-white text-[9px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5">
                {product.rating}<svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </span>
              <span className="text-[9px] text-[#666]">({product.reviewsCount})</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-sm font-bold text-[#C9A84C]">₹{product.price.toLocaleString()}</span>
            {product.oldPrice > product.price && (
              <span className="block text-[10px] text-[#666] line-through">₹{product.oldPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
