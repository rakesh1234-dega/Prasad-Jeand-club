'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedSize) {
      filtered = filtered.filter(p => p.sizes.includes(selectedSize));
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => b.id.localeCompare(a.id)); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      default: filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return filtered;
  }, [selectedCategory, selectedSize, sortBy, priceRange]);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-primary">Shop All Products</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar - Desktop */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
            <div className={`${showFilters ? 'absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto lg:relative lg:w-full' : ''} bg-white rounded-xl p-5 shadow-card sticky top-20`}>
              {showFilters && (
                <button onClick={() => setShowFilters(false)} className="lg:hidden absolute top-4 right-4 text-gray-500">✕</button>
              )}
              
              <h3 className="font-poppins font-semibold text-primary mb-4">Filters</h3>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" checked={selectedCategory === 'all'} onChange={() => setSelectedCategory('all')} className="text-secondary" />
                    <span className="text-sm text-gray-600">All Products</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" checked={selectedCategory === cat.id} onChange={() => setSelectedCategory(cat.id)} className="text-secondary" />
                      <span className="text-sm text-gray-600">{cat.icon} {cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                        selectedSize === size ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹500', range: [0, 500] },
                    { label: '₹500 - ₹1000', range: [500, 1000] },
                    { label: '₹1000 - ₹2000', range: [1000, 2000] },
                    { label: '₹2000 - ₹5000', range: [2000, 5000] },
                    { label: 'Above ₹5000', range: [5000, 10000] },
                    { label: 'All Prices', range: [0, 10000] },
                  ].map(item => (
                    <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange[0] === item.range[0] && priceRange[1] === item.range[1]}
                        onChange={() => setPriceRange(item.range)}
                        className="text-secondary"
                      />
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedSize(''); setPriceRange([0, 10000]); }}
                className="w-full py-2 text-sm text-secondary font-medium border border-secondary rounded-lg hover:bg-secondary/5 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-card">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 border rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
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
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-card">
                <span className="text-6xl">🔍</span>
                <h3 className="text-lg font-semibold text-gray-700 mt-4">No products found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedSize(''); setPriceRange([0, 10000]); }}
                  className="mt-4 px-6 py-2 bg-secondary text-white text-sm rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
