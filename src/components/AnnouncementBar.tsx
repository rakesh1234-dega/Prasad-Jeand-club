'use client';

import React from 'react';
import { useStore } from '@/store/useStore';

export default function AnnouncementBar() {
  const adminOffer = useStore((s) => s.adminOffer);

  const defaultText = '🚚 FREE SHIPPING above ₹999  |  Use code FIRST15 for 15% OFF  |  🔥 Flash Sale LIVE  |  ⭐ 50,000+ Happy Customers  |  7-Day Easy Returns';
  const text = adminOffer || defaultText;

  return (
    <div className="bg-[#C9A84C] py-1.5 overflow-hidden relative z-50">
      <div className="animate-marquee whitespace-nowrap flex">
        {[0, 1].map((i) => (
          <span key={i} className="inline-block text-[#0D0D0D] text-[11px] font-semibold tracking-wide mx-8">
            {text} &nbsp;&nbsp;&nbsp; {text}
          </span>
        ))}
      </div>
    </div>
  );
}
