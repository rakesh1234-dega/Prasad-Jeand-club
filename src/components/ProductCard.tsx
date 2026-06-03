'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useStore } from '@/store/useStore';

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);
  const inWishlist = wishlist.includes(product.id);

  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const badge = product.tags.includes('new') ? 'NEW' : product.tags.includes('trending') ? 'HOT' : product.tags.includes('bestseller') ? 'TOP' : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ productId: product.id, name: product.name, price: product.price, size: product.sizes[1] || product.sizes[0], color: product.colors[0], qty: 1, emoji: product.emoji });
    if ((window as any).__pjcToast) (window as any).__pjcToast('Added to bag ✓');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="card card-hover h-full flex flex-col">
        {/* Image: fixed 180px */}
        <div className="relative h-[180px] bg-[#222] flex items-center justify-center overflow-hidden">
          <span className="text-5xl opacity-50 group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>

          {/* Badge */}
          {badge && (
            <span className={`absolute top-2 left-2 ${badge === 'NEW' ? 'badge-new' : badge === 'HOT' ? 'badge-trending' : 'badge-top'}`}>
              {badge === 'TOP' ? '⭐ TOP' : badge}
            </span>
          )}
          {discount > 0 && <span className="absolute top-2 right-9 badge-sale">{discount}%</span>}

          {/* Wishlist Heart */}
          <button onClick={handleWishlist} className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <svg className={`w-3.5 h-3.5 ${inWishlist ? 'text-[#E74C3C] fill-[#E74C3C]' : 'text-white/70'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>

          {/* Stock Warning */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2">
              <span className="flex items-center gap-1 text-[8px] font-bold text-white bg-[#E74C3C]/90 px-1.5 py-0.5 rounded">
                <span className="w-1 h-1 bg-white rounded-full animate-urgency" />Only {product.stock} left
              </span>
            </div>
          )}

          {/* Hover Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
            <button onClick={handleAdd} className="w-full btn-gold-outline py-2 text-[10px]">ADD TO BAG</button>
          </div>
        </div>

        {/* Info */}
        <div className="p-2.5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-[11px] font-medium text-white/90 line-clamp-1 group-hover:text-[#C9A84C] transition-colors">{product.name}</h3>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-[#C9A84C]">₹{product.price.toLocaleString()}</span>
              {product.mrp > product.price && <span className="text-[10px] text-[#666] line-through">₹{product.mrp.toLocaleString()}</span>}
            </div>
            {discount > 0 && <span className="text-[9px] font-bold text-[#2ECC71]">{discount}% off</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
