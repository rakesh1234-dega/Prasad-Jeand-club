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
  const productId = params.id as string;
  const product = products.find(p => p.id === productId);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = product ? isInWishlist(product.id) : false;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  const productReviews = useMemo(() => {
    return reviews.filter(r => r.productId === productId);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">😕</span>
          <h2 className="text-xl font-semibold mt-4">Product not found</h2>
          <Link href="/shop" className="mt-4 inline-block px-6 py-2 bg-secondary text-white rounded-lg">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      if ((window as any).__pjcToast) (window as any).__pjcToast('Please select a size', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor || product.colors[0], quantity);
    if ((window as any).__pjcToast) (window as any).__pjcToast('Added to cart!', 'success');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      if ((window as any).__pjcToast) (window as any).__pjcToast('Please select a size', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor || product.colors[0], quantity);
    window.location.href = '/cart';
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      if ((window as any).__pjcToast) (window as any).__pjcToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      if ((window as any).__pjcToast) (window as any).__pjcToast('Added to wishlist!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-secondary">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-secondary">Shop</Link>
            <span>/</span>
            <Link href={`/shop/${product.category}`} className="hover:text-secondary capitalize">{product.category}</Link>
            <span>/</span>
            <span className="text-gray-800 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-card">
              <div className="h-[400px] md:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <span className="text-[120px] opacity-50">
                  {product.category === 'jeans' ? '👖' :
                   product.category === 'tshirts' ? '👕' :
                   product.category === 'shirts' ? '👔' :
                   product.category === 'hoodies' || product.category === 'jackets' ? '🧥' : '🩳'}
                </span>
                {product.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-secondary text-white text-sm font-bold px-3 py-1 rounded-lg">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-20 h-20 bg-white rounded-lg shadow-card border-2 border-transparent hover:border-secondary cursor-pointer flex items-center justify-center">
                  <span className="text-2xl opacity-40">
                    {product.category === 'jeans' ? '👖' : product.category === 'tshirts' ? '👕' : '👔'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-poppins font-bold text-primary mt-1">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center bg-green-500 text-white text-sm font-bold px-2 py-0.5 rounded">
                  <span>{product.rating}</span>
                  <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">{product.reviewsCount} Reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
              {product.oldPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.oldPrice.toLocaleString()}</span>
                  <span className="text-sm bg-green-100 text-green-700 font-semibold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">Inclusive of all taxes. Free shipping on orders above ₹999</p>

            {/* Size Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Select Size:</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border rounded-lg transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Select Color:</h4>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-primary scale-125 shadow-md' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quantity:</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 bg-gradient-to-r from-secondary to-secondary-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                ⚡ Buy Now
              </button>
              <button
                onClick={handleWishlist}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                  inWishlist ? 'bg-red-50 border-red-200' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <svg className={`w-5 h-5 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Delivery */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span>🚚</span><span>Free delivery on orders above ₹999</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>🔄</span><span>7-day easy returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>✅</span><span>100% genuine product</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Description & Reviews */}
        <div className="mt-12 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex border-b">
            {['description', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} {tab === 'reviews' && `(${productReviews.length})`}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'description' ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500">Brand</span>
                    <p className="font-medium text-sm">{product.brand}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500">Category</span>
                    <p className="font-medium text-sm capitalize">{product.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500">In Stock</span>
                    <p className="font-medium text-sm text-green-600">{product.stock} units</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500">Available Sizes</span>
                    <p className="font-medium text-sm">{product.sizes.join(', ')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {productReviews.length > 0 ? productReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        {review.rating} ⭐
                      </div>
                      <span className="text-sm font-medium">{review.userName}</span>
                      <span className="text-xs text-gray-400">{review.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                  </div>
                )) : (
                  <p className="text-center text-gray-400 py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-poppins font-bold text-primary mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
