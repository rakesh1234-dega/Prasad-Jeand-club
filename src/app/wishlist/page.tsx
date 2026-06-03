'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const wishlist = useStore((s) => s.wishlist);
  const products = useStore((s) => s.products);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);

  const items = products.filter(p => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">❤️</span>
          <h2 className="font-display text-xl font-bold text-white">Your wishlist is empty</h2>
          <p className="text-[#666] text-sm mt-2">Save products you love</p>
          <Link href="/shop" className="btn-gold inline-block mt-5">START WISHLIST →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-white mb-6">My Wishlist <span className="text-[#666] text-lg">({items.length})</span></h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map(p => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <button
                onClick={() => { addToCart({ productId: p.id, name: p.name, price: p.price, size: p.sizes[1] || p.sizes[0], color: p.colors[0], qty: 1, emoji: p.emoji }); toggleWishlist(p.id); if ((window as any).__pjcToast) (window as any).__pjcToast('Moved to cart ✓'); }}
                className="absolute bottom-12 left-2 right-2 btn-gold-sm text-center py-1.5 text-[9px]"
              >
                MOVE TO CART
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
