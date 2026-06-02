'use client';

import React, { useState, useEffect } from 'react';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

export default function FlashDealTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });

  useEffect(() => {
    // Set deal end time (2.5 hours from now or from saved time)
    const savedEndTime = localStorage.getItem('pjc_flash_end');
    let endTime: number;
    
    if (savedEndTime && parseInt(savedEndTime) > Date.now()) {
      endTime = parseInt(savedEndTime);
    } else {
      endTime = Date.now() + (2.5 * 60 * 60 * 1000); // 2.5 hours
      localStorage.setItem('pjc_flash_end', endTime.toString());
    }

    const timer = setInterval(() => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        // Reset timer
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
    <section className="py-12 bg-gradient-to-r from-primary via-primary-light to-primary">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-3xl">⚡</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white">Flash Deals</h2>
              <p className="text-sm text-gray-300">Hurry! Limited time offers</p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Ends in:</span>
            <div className="flex items-center gap-2">
              {[
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' },
              ].map((unit, i) => (
                <React.Fragment key={unit.label}>
                  <div className="bg-white rounded-lg p-2 min-w-[60px] text-center">
                    <span className="text-2xl font-bold text-primary font-poppins">
                      {unit.value.toString().padStart(2, '0')}
                    </span>
                    <p className="text-[9px] text-gray-500 font-medium">{unit.label}</p>
                  </div>
                  {i < 2 && <span className="text-2xl text-white font-bold">:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashProducts.map(product => (
            <ProductCard key={product.id} product={product} badge="⚡ Flash Deal" />
          ))}
        </div>
      </div>
    </section>
  );
}
