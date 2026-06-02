'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [sortBy, setSortBy] = useState('popular');
  const [selectedSize, setSelectedSize] = useState('');

  const categoryInfo = categories.find(c => c.id === category);
  const categoryName = categoryInfo?.name || category;

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.category === category);
    
    if (selectedSize) {
      filtered = filtered.filter(p => p.sizes.includes(selectedSize));
    }

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => b.id.localeCompare(a.id)); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      default: filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
    return filtered;
  }, [category, sortBy, selectedSize]);

  const sizes = category === 'jeans' || category === 'shorts'
    ? ['28', '30', '32', '34', '36', '38', '40']
    : ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-5xl mb-4 block">{categoryInfo?.icon}</span>
          <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white">{categoryName}</h1>
          <p className="text-gray-300 mt-2">{filteredProducts.length} products</p>
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
            <Link href="/" className="hover:text-secondary">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-secondary">Shop</Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sort & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white rounded-xl p-4 shadow-card">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSize('')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${!selectedSize ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600'}`}
            >
              All Sizes
            </button>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  selectedSize === size ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:border-secondary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/20"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl">
            <span className="text-6xl">🔍</span>
            <h3 className="text-lg font-semibold mt-4">No products in this size</h3>
            <button onClick={() => setSelectedSize('')} className="mt-3 px-6 py-2 bg-secondary text-white text-sm rounded-lg">
              Show All
            </button>
          </div>
        )}

        {/* Related Categories */}
        <div className="mt-12">
          <h3 className="text-lg font-poppins font-semibold text-primary mb-4">You May Also Like</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.filter(c => c.id !== category).map(cat => (
              <Link key={cat.id} href={`/shop/${cat.id}`} className="flex flex-col items-center min-w-[100px] p-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-medium mt-2">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
