'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';

const allCategories = [
  { id: 'shirts', label: 'Shirts', emoji: '👔' },
  { id: 'tshirts', label: 'T-Shirts', emoji: '👕' },
  { id: 'jeans', label: 'Jeans', emoji: '👖' },
  { id: 'hoodies', label: 'Hoodies', emoji: '🧥' },
  { id: 'jackets', label: 'Jackets', emoji: '🥼' },
  { id: 'shorts', label: 'Shorts', emoji: '🩳' },
];

export default function ShopPage() {
  const products = useStore((s) => s.products);
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [priceMax, setPriceMax] = useState(10000);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category) result = result.filter(p => p.category === category);
    if (size) result = result.filter(p => p.sizes.includes(size));
    result = result.filter(p => p.price <= priceMax);
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      default: result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }
    return result;
  }, [products, category, size, sortBy, priceMax]);

  const clearFilters = () => { setCategory(''); setSize(''); setPriceMax(10000); };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-[#2A2A2A] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-white">Shop All Products</h1>
            <p className="text-[10px] text-[#666]">{filtered.length} products</p>
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input text-xs py-2 px-3">
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 flex gap-5">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0">
          <div className="sticky top-16 space-y-6">
            {/* Categories */}
            <div>
              <h4 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Category</h4>
              <div className="space-y-1">
                <button onClick={() => setCategory('')} className={`block w-full text-left text-xs px-2 py-1.5 rounded ${!category ? 'text-[#C9A84C] bg-[rgba(201,168,76,0.08)] font-bold' : 'text-[#A0A0A0] hover:text-white'}`}>All</button>
                {allCategories.map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)} className={`flex items-center gap-2 w-full text-left text-xs px-2 py-1.5 rounded ${category === c.id ? 'text-[#C9A84C] bg-[rgba(201,168,76,0.08)] font-bold' : 'text-[#A0A0A0] hover:text-white'}`}>
                    <span className="text-sm">{c.emoji}</span>{c.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Price */}
            <div>
              <h4 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Max Price: ₹{priceMax.toLocaleString()}</h4>
              <input type="range" min={200} max={10000} step={100} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-[#C9A84C] h-1" />
            </div>
            {/* Size */}
            <div>
              <h4 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Size</h4>
              <div className="flex flex-wrap gap-1.5">
                {['XS','S','M','L','XL','XXL','28','30','32','34','36'].map(s => (
                  <button key={s} onClick={() => setSize(size === s ? '' : s)} className={`px-2.5 py-1 text-[10px] font-medium border rounded ${size === s ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#2A2A2A] text-[#A0A0A0] hover:border-[#C9A84C]'}`}>{s}</button>
                ))}
              </div>
            </div>
            {(category || size || priceMax < 10000) && (
              <button onClick={clearFilters} className="text-[11px] text-[#E74C3C] font-medium hover:underline">Clear All Filters ✕</button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-[#A0A0A0] text-sm">No products found</p>
              <button onClick={clearFilters} className="btn-gold-sm mt-4">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
