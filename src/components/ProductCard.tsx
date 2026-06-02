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
      if ((window as any).__pjcToast) (window as any).__pjcToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      if ((window as any).__pjcToast) (window as any).__pjcToast('Added to wishlist!', 'success');
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2">
        {/* Image */}
        <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40">
            {product.category === 'jeans' ? '👖' : 
             product.category === 'tshirts' ? '👕' : 
             product.category === 'shirts' ? '👔' : 
             product.category === 'hoodies' ? '🧥' : 
             product.category === 'jackets' ? '🧥' : '🩳'}
          </div>
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.discount > 0 && (
              <span className="bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-md">
                {product.discount}% OFF
              </span>
            )}
            {badge && (
              <span className="bg-accent text-primary text-[10px] font-bold px-2 py-1 rounded-md">
                {badge}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg 
              className={`w-4 h-4 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
              fill={inWishlist ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Quick Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-secondary"
          >
            + Add to Cart
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <svg className="w-2.5 h-2.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400">({product.reviewsCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
            {product.oldPrice > product.price && (
              <>
                <span className="text-sm text-gray-400 line-through">₹{product.oldPrice.toLocaleString()}</span>
                <span className="text-xs text-green-600 font-medium">{product.discount}% off</span>
              </>
            )}
          </div>

          {/* Sizes Preview */}
          <div className="flex gap-1 mt-2">
            {product.sizes.slice(0, 4).map(size => (
              <span key={size} className="text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] text-gray-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
