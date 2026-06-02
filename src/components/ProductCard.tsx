'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  badge?: string;
}

export default function ProductCard({ product, badge }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  // Marketing: Create urgency with low stock
  const isLowStock = product.stock <= 10;
  const isBestValue = product.discount >= 45;
  const viewersCount = Math.floor(Math.random() * 30) + 15; // Social proof

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
    if ((window as any).__pjcToast) {
      (window as any).__pjcToast('Added to cart!', 'success');
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      if ((window as any).__pjcToast) (window as any).__pjcToast('Added to wishlist!', 'success');
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-product hover:shadow-product-hover transition-all duration-300 hover:-translate-y-1 relative">
        
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          {/* Product Visual */}
          <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-60 group-hover:scale-110 transition-transform duration-500">
            {product.category === 'jeans' ? '👖' : 
             product.category === 'tshirts' ? '👕' : 
             product.category === 'shirts' ? '👔' : 
             product.category === 'hoodies' || product.category === 'jackets' ? '🧥' : '🩳'}
          </div>

          {/* MARKETING: Discount Badge - Top Left (Red = Urgency) */}
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-[11px] font-bold rounded-md shadow-sm">
                {product.discount}% OFF
              </span>
            </div>
          )}

          {/* MARKETING: Best Value / Trending Badge */}
          {badge && (
            <div className="absolute top-2 right-10 z-10">
              <span className="inline-flex items-center px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">
                {badge}
              </span>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg className={`w-4 h-4 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* MARKETING: Low Stock Urgency - Bottom */}
          {isLowStock && (
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <div className="bg-orange-50 border border-orange-200 rounded px-2 py-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-urgency"></span>
                <span className="text-[10px] font-semibold text-orange-700">Only {product.stock} left!</span>
              </div>
            </div>
          )}

          {/* Quick Add Button on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-light transition-colors shadow-lg"
            >
              ADD TO BAG
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3">
          {/* Brand */}
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
            {product.brand}
          </p>
          
          {/* Name */}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating - Social Proof */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="inline-flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {product.rating}
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400">({product.reviewsCount.toLocaleString()})</span>
          </div>

          {/* Price - Anchoring Psychology: Show old price first */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.oldPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">₹{product.oldPrice.toLocaleString()}</span>
                <span className="text-xs font-bold text-green-600">{product.discount}% off</span>
              </>
            )}
          </div>

          {/* MARKETING: Social Proof - Viewers */}
          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-50">
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] text-gray-400">{viewersCount} people viewing this</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
