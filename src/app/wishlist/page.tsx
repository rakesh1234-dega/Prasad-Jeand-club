'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: any) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    removeFromWishlist(product.id);
    if ((window as any).__pjcToast) (window as any).__pjcToast('Moved to cart!', 'success');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-8xl">❤️</span>
          <h2 className="text-2xl font-poppins font-bold text-primary mt-6">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mt-2">Save items you love for later</p>
          <Link href="/shop" className="inline-block mt-6 px-8 py-3 bg-secondary text-white font-medium rounded-xl">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-poppins font-bold text-primary mb-6">
          My Wishlist <span className="text-gray-400 text-lg">({items.length} items)</span>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map(product => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => handleMoveToCart(product)}
                className="absolute bottom-4 left-4 right-4 py-2 bg-secondary text-white text-xs font-medium rounded-lg hover:bg-secondary-dark transition-colors text-center"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
