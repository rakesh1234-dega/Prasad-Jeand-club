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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
    if ((window as any).__pjcToast) (window as any).__pjcToast('Added to cart! 🛒', 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (inWishlist) removeFromWishlist(product.id);
    else { addToWishlist(product); if ((window as any).__pjcToast) (window as any).__pjcToast('Wishlisted ❤️', 'success'); }
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] overflow-hidden hover:border-[#C9A84C]/40 transition-all duration-200 hover:-translate-y-0.5 h-full">
        {/* Image - Fixed height for uniformity */}
        <div className="relative h-[220px] bg-[#222] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:scale-105 transition-transform duration-300">
            {product.category === 'jeans' ? '👖' : product.category === 'tshirts' ? '👕' : product.category === 'shirts' ? '👔' : product.category === 'hoodies' || product.category === 'jackets' ? '🧥' : '🩳'}
          </div>
          {product.discount > 0 && <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#E74C3C] text-white text-[9px] font-bold rounded">{product.discount}%</span>}
          {badge && <span className="absolute top-2 right-8 px-1.5 py-0.5 bg-[#C9A84C] text-black text-[8px] font-bold rounded">{badge}</span>}
          <button onClick={handleWishlist} className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
            <svg className={`w-3 h-3 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-white/70'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          {product.stock <= 10 && <div className="absolute bottom-1 left-1"><span className="text-[8px] font-bold text-white bg-[#E74C3C]/90 px-1.5 py-0.5 rounded">Only {product.stock} left</span></div>}
          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleAddToCart} className="w-full py-2 gradient-gold text-black text-[10px] font-bold rounded uppercase">Add to Bag</button>
          </div>
        </div>
        {/* Info */}
        <div className="p-2.5">
          <p className="text-[8px] text-[#666] uppercase tracking-wider">{product.brand}</p>
          <h3 className="text-[11px] font-medium text-[#eee] line-clamp-1 mt-0.5">{product.name}</h3>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-[#C9A84C]">₹{product.price.toLocaleString()}</span>
              {product.oldPrice > product.price && <span className="text-[10px] text-[#666] line-through">₹{product.oldPrice.toLocaleString()}</span>}
            </div>
            <span className="text-[9px] text-[#2ECC71] font-bold bg-[#2ECC71]/10 px-1 py-0.5 rounded">{product.rating}★</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
