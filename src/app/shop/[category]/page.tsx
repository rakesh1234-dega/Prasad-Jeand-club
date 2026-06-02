'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';

// Category-specific filter configurations
const categoryFilters: Record<string, { label: string; options: string[] }[]> = {
  shirts: [
    { label: 'Style', options: ['Formal', 'Casual', 'Party Wear', 'Denim', 'Linen', 'Printed', 'Checked', 'Plain'] },
    { label: 'Collar', options: ['Regular Collar', 'Button-Down', 'Mandarin', 'Spread Collar', 'Band Collar'] },
    { label: 'Sleeve', options: ['Full Sleeve', 'Half Sleeve', 'Roll-Up Sleeve'] },
    { label: 'Fit', options: ['Slim Fit', 'Regular Fit', 'Relaxed Fit'] },
    { label: 'Fabric', options: ['Cotton', 'Linen', 'Denim', 'Polyester', 'Rayon'] },
    { label: 'Occasion', options: ['Office', 'Party', 'Casual', 'Wedding', 'Date Night'] },
  ],
  tshirts: [
    { label: 'Style', options: ['Round Neck', 'V-Neck', 'Polo', 'Oversized', 'Henley', 'Graphic', 'Plain', 'Striped'] },
    { label: 'Sleeve', options: ['Half Sleeve', 'Full Sleeve', 'Sleeveless', '3/4 Sleeve'] },
    { label: 'Fit', options: ['Regular Fit', 'Slim Fit', 'Oversized', 'Muscle Fit'] },
    { label: 'Fabric', options: ['100% Cotton', 'Cotton Blend', 'Polyester', 'Drifit'] },
    { label: 'Occasion', options: ['Daily Wear', 'Sports', 'Gym', 'Casual', 'Streetwear'] },
  ],
  jeans: [
    { label: 'Fit', options: ['Slim Fit', 'Skinny', 'Straight', 'Relaxed', 'Boot Cut', 'Tapered', 'Baggy'] },
    { label: 'Wash', options: ['Dark Wash', 'Light Wash', 'Mid Wash', 'Black', 'Raw Denim', 'Acid Wash'] },
    { label: 'Style', options: ['Plain', 'Ripped', 'Distressed', 'Cargo', 'Jogger', 'Patch Work'] },
    { label: 'Rise', options: ['Low Rise', 'Mid Rise', 'High Rise'] },
    { label: 'Stretch', options: ['Stretch', 'Non-Stretch', 'Super Stretch'] },
    { label: 'Occasion', options: ['Daily Wear', 'Party', 'Office Casual', 'Weekend'] },
  ],
  hoodies: [
    { label: 'Type', options: ['Pullover', 'Zip-Up', 'Oversized', 'Crop Hoodie', 'Sleeveless'] },
    { label: 'Material', options: ['Fleece', 'Cotton', 'Polyester', 'French Terry'] },
    { label: 'Fit', options: ['Regular', 'Oversized', 'Slim'] },
    { label: 'Feature', options: ['With Pocket', 'Without Pocket', 'Graphic Print', 'Plain', 'Logo'] },
    { label: 'Season', options: ['Winter', 'All Season', 'Light Layer'] },
  ],
  jackets: [
    { label: 'Type', options: ['Denim Jacket', 'Bomber', 'Leather', 'Windbreaker', 'Puffer', 'Blazer', 'Trucker'] },
    { label: 'Material', options: ['Denim', 'Faux Leather', 'Nylon', 'Cotton', 'Polyester'] },
    { label: 'Closure', options: ['Button', 'Zip', 'Snap Button'] },
    { label: 'Season', options: ['Winter', 'Monsoon', 'All Season', 'Light Layer'] },
    { label: 'Occasion', options: ['Casual', 'Biker', 'Sports', 'Formal', 'Party'] },
  ],
  shorts: [
    { label: 'Type', options: ['Denim Shorts', 'Chino', 'Cargo', 'Athletic', 'Beach', 'Bermuda'] },
    { label: 'Length', options: ['Above Knee', 'Knee Length', 'Below Knee'] },
    { label: 'Fit', options: ['Regular', 'Slim', 'Relaxed'] },
    { label: 'Material', options: ['Denim', 'Cotton', 'Polyester', 'Linen'] },
    { label: 'Occasion', options: ['Beach', 'Gym', 'Casual', 'Sports', 'Lounge'] },
  ],
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [sortBy, setSortBy] = useState('popular');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');

  const categoryInfo = categories.find(c => c.id === category);
  const categoryName = categoryInfo?.name || category;
  const filters = categoryFilters[category] || [];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.category === category);
    
    if (selectedSize) {
      filtered = filtered.filter(p => p.sizes.includes(selectedSize));
    }

    // Price filter
    switch (priceRange) {
      case 'under500': filtered = filtered.filter(p => p.price < 500); break;
      case '500-1000': filtered = filtered.filter(p => p.price >= 500 && p.price <= 1000); break;
      case '1000-2000': filtered = filtered.filter(p => p.price >= 1000 && p.price <= 2000); break;
      case '2000-5000': filtered = filtered.filter(p => p.price >= 2000 && p.price <= 5000); break;
      case 'above5000': filtered = filtered.filter(p => p.price > 5000); break;
    }

    // Sort
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => b.id.localeCompare(a.id)); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'discount': filtered.sort((a, b) => b.discount - a.discount); break;
      default: filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
    return filtered;
  }, [category, sortBy, selectedSize, priceRange]);

  const sizes = category === 'jeans' || category === 'shorts'
    ? ['28', '30', '32', '34', '36', '38', '40']
    : ['S', 'M', 'L', 'XL', 'XXL'];

  const clearAllFilters = () => {
    setSelectedSize('');
    setSelectedFilters({});
    setPriceRange('all');
    setSortBy('popular');
  };

  const hasActiveFilters = selectedSize || priceRange !== 'all' || Object.keys(selectedFilters).length > 0;

  return (
    <div className="min-h-screen bg-white page-enter">
      {/* Category Hero */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-5xl mb-3 block">{categoryInfo?.icon}</span>
          <h1 className="text-3xl md:text-4xl font-poppins font-black text-white">{categoryName}</h1>
          <p className="text-gray-400 mt-2 text-sm">{filteredProducts.length} Products | Up to 50% OFF</p>
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white font-medium">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Bar: Sort + Filter Toggle */}
        <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 bg-white border border-gray-200 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters
            </button>
            <span className="text-sm text-gray-500 hidden md:block">
              Showing <strong className="text-gray-800">{filteredProducts.length}</strong> products
            </span>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-xs text-red-600 font-medium hover:text-red-700 px-2 py-1 bg-red-50 rounded">
                Clear All ✕
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        <div className="flex gap-6">
          {/* FILTER SIDEBAR */}
          <aside className={`${showMobileFilters ? 'fixed inset-0 z-50 bg-black/50' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
            <div className={`${showMobileFilters ? 'absolute right-0 top-0 h-full w-80 bg-white p-5 overflow-y-auto shadow-2xl' : ''} lg:relative lg:w-full`}>
              {showMobileFilters && (
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h3 className="font-poppins font-bold text-lg">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">✕</button>
                </div>
              )}

              <div className="space-y-6 bg-white lg:border lg:border-gray-100 lg:rounded-xl lg:p-5 lg:sticky lg:top-20">
                <h3 className="hidden lg:block font-poppins font-bold text-sm text-gray-900 uppercase tracking-wider">Filters</h3>

                {/* Size Filter */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Size</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                        className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${
                          selectedSize === size
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Price</h4>
                  <div className="space-y-1.5">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: 'under500', label: 'Under ₹500' },
                      { value: '500-1000', label: '₹500 - ₹1,000' },
                      { value: '1000-2000', label: '₹1,000 - ₹2,000' },
                      { value: '2000-5000', label: '₹2,000 - ₹5,000' },
                      { value: 'above5000', label: 'Above ₹5,000' },
                    ].map(item => (
                      <label key={item.value} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === item.value}
                          onChange={() => setPriceRange(item.value)}
                          className="w-3.5 h-3.5 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-600 group-hover:text-gray-900">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* CATEGORY-SPECIFIC FILTERS */}
                {filters.map(filter => (
                  <div key={filter.label}>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{filter.label}</h4>
                    <div className="space-y-1.5">
                      {filter.options.map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters[filter.label] === option}
                            onChange={() => {
                              setSelectedFilters(prev => {
                                if (prev[filter.label] === option) {
                                  const next = { ...prev };
                                  delete next[filter.label];
                                  return next;
                                }
                                return { ...prev, [filter.label]: option };
                              });
                            }}
                            className="w-3.5 h-3.5 text-red-600 rounded focus:ring-red-500"
                          />
                          <span className="text-xs text-gray-600 group-hover:text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Color Filter */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Black', hex: '#000000' },
                      { name: 'White', hex: '#ffffff' },
                      { name: 'Navy', hex: '#1e3a5f' },
                      { name: 'Blue', hex: '#3b82f6' },
                      { name: 'Red', hex: '#dc2626' },
                      { name: 'Green', hex: '#16a34a' },
                      { name: 'Grey', hex: '#6b7280' },
                      { name: 'Brown', hex: '#78350f' },
                    ].map(color => (
                      <button
                        key={color.name}
                        title={color.name}
                        className="w-7 h-7 rounded-full border-2 border-gray-200 hover:border-red-400 transition-colors hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2.5 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    CLEAR ALL FILTERS
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSize && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs font-medium rounded-full">
                    Size: {selectedSize}
                    <button onClick={() => setSelectedSize('')} className="text-gray-400 hover:text-red-600">✕</button>
                  </span>
                )}
                {priceRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs font-medium rounded-full">
                    {priceRange}
                    <button onClick={() => setPriceRange('all')} className="text-gray-400 hover:text-red-600">✕</button>
                  </span>
                )}
                {Object.entries(selectedFilters).map(([key, val]) => (
                  <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs font-medium rounded-full">
                    {key}: {val}
                    <button onClick={() => setSelectedFilters(prev => { const n = {...prev}; delete n[key]; return n; })} className="text-gray-400 hover:text-red-600">✕</button>
                  </span>
                ))}
              </div>
            )}

            {/* Offer Banner */}
            <div className="mb-6 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">🔥 {categoryName} Special Offer</p>
                <p className="text-red-100 text-xs mt-0.5">Up to 50% off + Extra 10% with code PRASAD10</p>
              </div>
              <span className="text-white text-xs font-bold px-3 py-1 bg-white/20 rounded-lg">LIMITED TIME</span>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-5xl block mb-4">🔍</span>
                <h3 className="text-lg font-poppins font-bold text-gray-700">No products found</h3>
                <p className="text-sm text-gray-500 mt-1">Try different filters or clear all</p>
                <button onClick={clearAllFilters} className="mt-4 px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Categories */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="text-lg font-poppins font-bold text-gray-900 mb-4">You Might Also Like</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.filter(c => c.id !== category).map(cat => (
              <Link key={cat.id} href={`/shop/${cat.id}`} className="flex flex-col items-center min-w-[90px] p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 hover:-translate-y-1 transition-all">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 mt-1.5">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
