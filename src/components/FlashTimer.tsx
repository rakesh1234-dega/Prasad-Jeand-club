'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function FlashTimer() {
  const flashOffers = useStore((s) => s.flashOffers);
  const [time, setTime] = useState({ h: 2, m: 34, s: 17 });
  const [viewers, setViewers] = useState(847);

  // Find active offer
  const activeOffer = flashOffers.find(o => new Date(o.endsAt).getTime() > Date.now());

  useEffect(() => {
    const endTime = activeOffer
      ? new Date(activeOffer.endsAt).getTime()
      : Date.now() + (2 * 60 * 60 + 34 * 60 + 17) * 1000; // static fallback

    const timer = setInterval(() => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setTime({ h: 0, m: 0, s: 0 });
        return;
      }
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);

    // Viewer count fluctuation
    const viewerTimer = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 60) - 30);
    }, 8000);

    return () => { clearInterval(timer); clearInterval(viewerTimer); };
  }, [activeOffer]);

  return (
    <section className="mx-4 my-6 rounded-xl bg-gradient-to-r from-[#1A0000] to-[#2D0A0A] border border-[#E74C3C]/20 p-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              {activeOffer ? activeOffer.title : 'FLASH SALE'}
            </h3>
            <p className="text-[11px] text-[#E74C3C]/80">{Math.abs(viewers)} people shopping this sale</p>
          </div>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center gap-1.5">
          {[
            { val: time.h, label: 'HRS' },
            { val: time.m, label: 'MIN' },
            { val: time.s, label: 'SEC' },
          ].map((unit, i) => (
            <React.Fragment key={unit.label}>
              <div className="bg-white/10 rounded-md px-2.5 py-1.5 min-w-[44px] text-center">
                <span className="text-lg font-bold text-white font-body animate-countFlip block">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-[#A0A0A0] uppercase tracking-wider">{unit.label}</span>
              </div>
              {i < 2 && <span className="text-lg text-white/50 font-bold">:</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Right */}
        <Link href="/shop" className="btn-gold text-[10px] px-5 py-2.5">
          VIEW DEALS →
        </Link>
      </div>
    </section>
  );
}
