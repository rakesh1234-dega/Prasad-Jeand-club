'use client';

import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { products as defaultProducts, categories } from '@/data/products';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState('all');
  const [allProducts, setAllProducts] = useState(defaultProducts);

  // Load admin-added products
  useEffect(() => {
    const adminProds = localStorage.getItem('pjc_admin_products');
    if (adminProds) {
      const parsed = JSON.parse(adminProds);
      const mapped = parsed.map((p: any) => ({
        ...p, description: p.name, images: [], rating: 4.5, reviewsCount: 0,
        brand: 'Prasad Jeans Club', isFeatured: p.isFeatured || false,
        isTrending: p.isTrending || false, isBestSeller: p.isBestSeller || false,
      }));
      setAllProducts([...mapped, ...defaultProducts]);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
    if (selectedSize) filtered = filtered.filter(p => p.sizes.includes(selectedSize));
    switch (priceRange) {
      case 'under500': filtered = filtered.filter(p => p.price < 500); break;
      case '500-1000': filtered = filtered.filter(p => p.price >= 500 && p.price <= 1000); break;
      case '1000-2000': filtered = filtered.filter(p => p.price >= 1000 && p.price <= 2000); break;
      case 'above2000': filtered = filtered.filter(p => p.price > 2000); break;
    }
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'discount': filtered.sort((a, b) => b.discount - a.discount); break;
      default: filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
    return filtered;
  }, [allProducts, selectedCategory, selectedSize, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Small Banner - Full Width */}
      <div className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white font-display">Shop All Products</h1>
            <p className="text-[10px] text-[#666]">{filteredProducts.length} products found</p>
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs bg-[#222] border border-[#2A2A2A] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A84C]">
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low→High</option>
            <option value="price-high">Price: High→Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Best Discount</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-5">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-16 space-y-5">
              {/* Category */}
              <div>
                <h4 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Category</h4>
                <div className="space-y-1">
                  <button onClick={() => setSelectedCategory('all')} className={`block w-full text-left px-2 py-1.5 rounded text-xs ${selectedCategory === 'all' ? 'bg-[#C9A84C]/10 text-[#C9A84C] font-bold' : 'text-[#A0A0A0] hover:text-white'}`}>All</button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs ${selectedCategory === c.id ? 'bg-[#C9A84C]/10 text-[#C9A84C] font-bold' : 'text-[#A0A0A0] hover:text-white'}`}>
                      <span className="text-sm">{c.icon}</span>{c.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <h4 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Price</h4>
                <div className="space-y-1">
                  {[{v:'all',l:'All'},{v:'under500',l:'Under ₹500'},{v:'500-1000',l:'₹500-₹1000'},{v:'1000-2000',l:'₹1000-₹2000'},{v:'above2000',l:'Above ₹2000'}].map(p=>(
                    <button key={p.v} onClick={()=>setPriceRange(p.v)} className={`block w-full text-left px-2 py-1.5 rounded text-xs ${priceRange===p.v?'bg-[#C9A84C]/10 text-[#C9A84C] font-bold':'text-[#A0A0A0] hover:text-white'}`}>{p.l}</button>
                  ))}
                </div>
              </div>
              {/* Size */}
              <div>
                <h4 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Size</h4>
                <div className="flex flex-wrap gap-1">
                  {['S','M','L','XL','XXL','28','30','32','34','36'].map(s=>(
                    <button key={s} onClick={()=>setSelectedSize(selectedSize===s?'':s)} className={`px-2 py-1 text-[10px] rounded border ${selectedSize===s?'bg-[#C9A84C] text-black border-[#C9A84C] font-bold':'border-[#2A2A2A] text-[#A0A0A0] hover:border-[#C9A84C]'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid - 5 per row */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <span className="text-4xl block mb-3">🔍</span>
                <p className="text-[#A0A0A0] text-sm">No products found</p>
                <button onClick={()=>{setSelectedCategory('all');setSelectedSize('');setPriceRange('all');}} className="mt-3 px-4 py-2 gradient-gold text-black text-xs font-bold rounded-lg">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
