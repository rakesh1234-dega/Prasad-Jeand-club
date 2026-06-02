'use client';

import React, { useState, useEffect } from 'react';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

export default function FlashDealTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });

  useEffect(() => {
    const savedEndTime = localStorage.getItem('pjc_flash_end');
    let endTime: number;
    
    if (savedEndTime && parseInt(savedEndTime) > Date.now()) {
      endTime = parseInt(savedEndTime);
    } else {
      endTime = Date.now() + (2.5 * 60 * 60 * 1000);
      localStorage.setItem('pjc_flash_end', endTime.toString());
    }

    const timer = setInterval(() => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        const newEndTime = Date.now() + (2.5 * 60 * 60 * 1000);
        localStorage.setItem('pjc_flash_end', newEndTime.toString());
        setTimeLeft({ hours: 2, minutes: 30, seconds: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter(p => p.discount >= 48).slice(0, 4);

  return (
    <section className="py-10 bg-gradient-to-r from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-sale-tag">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white">
                FLASH SALE
              </h2>
              <p className="text-red-200 text-sm">Grab before it&apos;s gone!</p>
            </div>
          </div>

          {/* MARKETING: Countdown Timer - Creates URGENCY */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-200 font-medium">Ends in:</span>
            <div className="flex items-center gap-1.5">
              {[
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' },
              ].map((unit, i) => (
                <React.Fragment key={unit.label}>
                  <div className="bg-white rounded-lg px-3 py-2 min-w-[52px] text-center shadow-lg">
                    <span className="text-xl font-bold text-gray-900 font-poppins animate-count block">
                      {unit.value.toString().padStart(2, '0')}
                    </span>
                    <p className="text-[8px] font-bold text-gray-500 mt-0.5">{unit.label}</p>
                  </div>
                  {i < 2 && <span className="text-xl text-white font-bold">:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* MARKETING: Urgency bar */}
        <div className="bg-red-900/50 rounded-lg px-4 py-2 mb-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-urgency"></span>
          <p className="text-sm text-yellow-100 font-medium">
            🔥 <strong>847 people</strong> are shopping this sale right now!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {flashProducts.map(product => (
            <ProductCard key={product.id} product={product} badge="⚡ Flash Deal" />
          ))}
        </div>
      </div>
    </section>
  );
}
