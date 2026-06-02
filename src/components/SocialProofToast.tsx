'use client';

import React, { useState, useEffect } from 'react';

const messages = [
  { icon: '🛍️', text: 'Rahul from Mumbai just bought Classic Slim Fit Jeans' },
  { icon: '⭐', text: 'Amit gave 5 stars to the Oxford Shirt' },
  { icon: '🔥', text: '32 people viewing Denim Jacket right now' },
  { icon: '📦', text: "Vijay's order from Delhi just shipped" },
  { icon: '🛍️', text: 'Kiran from Hyderabad just bought Premium Hoodie' },
  { icon: '⭐', text: 'Suresh gave 5 stars to Ripped Jeans' },
  { icon: '🔥', text: '18 people added Polo T-Shirt to cart' },
  { icon: '📦', text: "Priya's order from Bangalore was delivered" },
];

export default function SocialProofToast() {
  const [current, setCurrent] = useState<typeof messages[0] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let index = 0;
    const showNext = () => {
      setCurrent(messages[index % messages.length]);
      setVisible(true);
      index++;

      // Hide after 4 seconds
      setTimeout(() => setVisible(false), 4000);
    };

    // First notification after 8 seconds
    const firstTimer = setTimeout(showNext, 8000);

    // Then every 25-40 seconds
    const interval = setInterval(showNext, 25000 + Math.random() * 15000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  if (!current || !visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] animate-slideInLeft max-w-xs">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 flex items-center gap-3 shadow-lg">
        <span className="text-xl flex-shrink-0">{current.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white font-medium leading-snug">{current.text}</p>
          <p className="text-[10px] text-[#666] mt-0.5">Just now</p>
        </div>
        <button onClick={() => setVisible(false)} className="text-[#666] hover:text-white text-xs">✕</button>
      </div>
    </div>
  );
}
