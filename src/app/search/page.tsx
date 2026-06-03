'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const products = useStore((s) => s.products);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [query, products]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-xl font-bold text-white">
          {query ? <>Results for &ldquo;<span className="text-[#C9A84C]">{query}</span>&rdquo;</> : 'Search Products'}
        </h1>
        <p className="text-[11px] text-[#666] mt-1">{results.length} products found</p>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-5xl block mb-3">🔍</span>
            <p className="text-[#A0A0A0] text-sm">{query ? `No results for "${query}"` : 'Start typing to search'}</p>
            <div className="flex justify-center gap-2 mt-4">
              {['Jeans','Shirts','Hoodies'].map(c => (
                <Link key={c} href={`/shop/${c.toLowerCase()}`} className="btn-gold-sm">{c}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
