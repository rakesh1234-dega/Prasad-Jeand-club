'use client';

import React from 'react';

// Full page loading spinner
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-secondary rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-4">Loading...</p>
      </div>
    </div>
  );
}

// Product card skeleton loader
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

// Product grid skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Cart item skeleton
export function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-card flex gap-4 animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}

// Order card skeleton
export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-card animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
        <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
        <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

// Profile page skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl p-6 shadow-card flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-40"></div>
          <div className="h-3 bg-gray-200 rounded w-56"></div>
        </div>
      </div>
    </div>
  );
}

// Inline button loading state
export function ButtonLoader({ text = 'Processing...' }: { text?: string }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      {text}
    </span>
  );
}

// Section loading placeholder
export function SectionLoader() {
  return (
    <div className="py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-7 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-72 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Empty state component
export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  actionLabel?: string; 
  actionHref?: string;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <span className="text-7xl block mb-4">{icon}</span>
        <h3 className="text-xl font-poppins font-bold text-primary">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
        {actionLabel && actionHref && (
          <a 
            href={actionHref} 
            className="inline-block mt-6 px-8 py-3 bg-secondary text-white font-medium rounded-xl hover:bg-secondary-dark transition-colors"
          >
            {actionLabel}
          </a>
        )}
      </div>
    </div>
  );
}
