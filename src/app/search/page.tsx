'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-poppins font-bold text-primary">
            {query ? `Results for "${query}"` : 'Search Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{results.length} products found</p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-card">
            <span className="text-6xl">🔍</span>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">
              {query ? `No results for "${query}"` : 'Start typing to search'}
            </h3>
            <p className="text-sm text-gray-500 mt-2">Try searching for jeans, shirts, t-shirts, hoodies...</p>
            <Link href="/shop" className="inline-block mt-4 px-6 py-2 bg-secondary text-white text-sm rounded-lg">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
