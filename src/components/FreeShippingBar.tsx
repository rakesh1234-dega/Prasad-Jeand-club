'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function FreeShippingBar() {
  const { getSubtotal } = useCart();
  const subtotal = getSubtotal();
  const threshold = 999;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);
  const unlocked = subtotal >= threshold;

  if (subtotal === 0) return null;

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 mb-4">
      {unlocked ? (
        <div className="flex items-center gap-2">
          <span className="text-lg">🎉</span>
          <p className="text-xs font-bold text-[#2ECC71]">You&apos;ve unlocked FREE shipping!</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[#A0A0A0] mb-2">
            You&apos;re <strong className="text-[#C9A84C]">₹{remaining.toLocaleString()}</strong> away from FREE shipping!
          </p>
          <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full gradient-gold transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}
