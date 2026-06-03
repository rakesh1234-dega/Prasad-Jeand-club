'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';

const categoryMeta: Record<string, { name: string; emoji: string; filters: { label: string; options: string[] }[] }> = {
  shirts: { name: 'Shirts', emoji: '👔', filters: [{ label: 'Style', options: ['Formal','Casual','Checked','Plain','Denim','Printed'] }, { label: 'Collar', options: ['Regular','Button-Down','Mandarin','Band'] }, { label: 'Sleeve', options: ['Full','Half','Roll-Up'] }, { label: 'Fit', options: ['Slim','Regular','Relaxed'] }] },
  tshirts: { name: 'T-Shirts', emoji: '👕', filters: [{ label: 'Style', options: ['Round Neck','V-Neck','Polo','Oversized','Henley'] }, { label: 'Sleeve', options: ['Half','Full','Sleeveless'] }, { label: 'Fit', options: ['Slim','Regular','Oversized'] }] },
  jeans: { name: 'Jeans', emoji: '👖', filters: [{ label: 'Fit', options: ['Slim','Skinny','Straight','Boot Cut','Relaxed','Tapered'] }, { label: 'Wash', options: ['Dark','Light','Mid','Black','Raw'] }, { label: 'Rise', options: ['Low','Mid','High'] }] },
  hoodies: { name: 'Hoodies', emoji: '🧥', filters: [{ label: 'Type', options: ['Pullover','Zip-Up','Oversized'] }, { label: 'Material', options: ['Fleece','Cotton','French Terry'] }, { label: 'Fit', options: ['Regular','Oversized','Slim'] }] },
  jackets: { name: 'Jackets', emoji: '🥼', filters: [{ label: 'Type', options: ['Denim','Bomber','Leather','Windbreaker','Puffer'] }, { label: 'Season', options: ['Winter','Monsoon','All Season'] }] },
  shorts: { name: 'Shorts', emoji: '🩳', filters: [{ label: 'Type', options: ['Denim','Chino','Cargo','Athletic','Beach'] }, { label: 'Length', options: ['Above Knee','Knee','Below Knee'] }] },
};

const allCategories = Object.entries(categoryMeta).map(([id, m]) => ({ id, ...m }));

export default function CategoryPage() {
  const params = useParams();
  const cat = params.category as string;
  const products = useStore((s) => s.products);
  const [sortBy, setSortBy] = useState('popular');
  const [size, setSize] = useState('');

  const meta = categoryMeta[cat] || { name: cat, emoji: '🛍️', filters: [] };

  const filtered = useMemo(() => {
    let result = products.filter(p => p.category === cat);
    if (size) result = result.filter(p => p.sizes.includes(size));
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'discount': result.sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price)); break;
      default: result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }
    return result;
  }, [products, cat, sortBy, size]);

  const sizes = cat === 'jeans' || cat === 'shorts' ? ['28','30','32','34','36','38'] : ['XS','S','M','L','XL','XXL'];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#111] border-b border-[#2A2A2A] py-10 text-center">
        <span className="text-4xl block mb-2">{meta.emoji}</span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">{meta.name}</h1>
        <p className="text-[11px] text-[#666] mt-1">{filtered.length} Products • Up to 50% OFF</p>
        <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-[#666]">
          <Link href="/" className="hover:text-[#C9A84C]">Home</Link><span>/</span>
          <Link href="/shop" className="hover:text-[#C9A84C]">Shop</Link><span>/</span>
          <span className="text-white">{meta.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 flex gap-5">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0">
          <div className="sticky top-16 space-y-5">
            {/* Size */}
            <div>
              <h4 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Size</h4>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSize(size === s ? '' : s)} className={`px-2.5 py-1 text-[10px] font-medium border rounded ${size === s ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#2A2A2A] text-[#A0A0A0] hover:border-[#C9A84C]'}`}>{s}</button>
                ))}
              </div>
            </div>
            {/* Category-specific filters */}
            {meta.filters.map(f => (
              <div key={f.label}>
                <h4 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-2">{f.label}</h4>
                <div className="space-y-1">
                  {f.options.map(o => (
                    <label key={o} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded bg-[#1A1A1A] border-[#2A2A2A] text-[#C9A84C] focus:ring-[#C9A84C]" />
                      <span className="text-xs text-[#A0A0A0] group-hover:text-white">{o}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {/* Sort + offer */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] text-[#A0A0A0]">{filtered.length} products</p>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input text-xs py-1.5 px-3">
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>

          {/* Offer banner */}
          <div className="card border-[#E74C3C]/20 bg-gradient-to-r from-[#1A0000] to-[#1A1A1A] rounded-lg p-3 mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">🔥 {meta.name} Special — Up to 50% OFF</p>
              <p className="text-[10px] text-[#E74C3C]/70 mt-0.5">Use code FLASH30 for extra 30% off</p>
            </div>
            <span className="text-[9px] font-bold text-[#E74C3C] bg-[#E74C3C]/10 px-2 py-1 rounded">LIMITED</span>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16"><span className="text-4xl block mb-2">🔍</span><p className="text-[#A0A0A0] text-sm">No products in this category yet</p></div>
          )}

          {/* Related */}
          <div className="mt-10 pt-6 border-t border-[#2A2A2A]">
            <h3 className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-3">Related Categories</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allCategories.filter(c => c.id !== cat).map(c => (
                <Link key={c.id} href={`/shop/${c.id}`} className="card rounded-lg px-4 py-3 flex flex-col items-center min-w-[80px] card-hover">
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-[10px] text-[#A0A0A0] mt-1">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
