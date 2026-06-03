'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#111] border-b border-[#2A2A2A] py-12 text-center">
        <h1 className="font-display text-3xl font-bold text-white">About Us</h1>
        <p className="text-[#666] text-sm mt-1">The Prasad Jeans Club Story</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="card rounded-xl p-6">
          <h2 className="font-display text-lg font-bold text-white mb-3">Our Story</h2>
          <p className="text-sm text-[#A0A0A0] leading-relaxed">Prasad Jeans Club was founded in 2020 with a mission to deliver premium men&apos;s fashion at honest prices. From a small shop to serving 50,000+ customers across India, we&apos;ve grown by staying true to quality.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card rounded-xl p-6"><span className="text-3xl block mb-2">🎯</span><h3 className="font-display text-base font-bold text-white">Mission</h3><p className="text-xs text-[#A0A0A0] mt-1">Quality fashion for every man, at prices that make sense.</p></div>
          <div className="card rounded-xl p-6"><span className="text-3xl block mb-2">🌟</span><h3 className="font-display text-base font-bold text-white">Vision</h3><p className="text-xs text-[#A0A0A0] mt-1">India&apos;s most trusted men&apos;s fashion brand by 2030.</p></div>
        </div>
        <div className="card rounded-xl p-6 gradient-gold text-center">
          <div className="grid grid-cols-3 gap-4">
            {[{n:'1000+',l:'Products'},{n:'50K+',l:'Customers'},{n:'100+',l:'Cities'}].map(s=>(
              <div key={s.l}><p className="text-2xl font-bold text-black">{s.n}</p><p className="text-[10px] text-black/70">{s.l}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
