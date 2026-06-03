'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';

const names = ['Rahul', 'Arjun', 'Karthik', 'Vijay', 'Suresh', 'Anil', 'Priya', 'Neha', 'Divya', 'Meera'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Ongole'];
const defaultProducts = ['Classic Slim Fit Jeans', 'Premium Fleece Hoodie', 'Oxford Button-Down Shirt', 'Graphic Oversized Tee', 'Denim Jacket'];

export default function SocialProofToast() {
  const products = useStore((s) => s.products);
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const generateMessage = useCallback(() => {
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const productNames = products.length > 0 ? products.map(p => p.name) : defaultProducts;
    const product = productNames[Math.floor(Math.random() * productNames.length)];
    return `🛍️ ${name} from ${city} just bought ${product}`;
  }, [products]);

  useEffect(() => {
    const showToast = () => {
      if (visible) return;
      setMessage(generateMessage());
      setVisible(true);
      setTimeout(() => setVisible(false), 3500);
    };

    // First after 8s
    const first = setTimeout(showToast, 8000);

    // Then every 25-40s
    const interval = setInterval(() => {
      const delay = 25000 + Math.random() * 15000;
      setTimeout(showToast, delay);
    }, 30000);

    return () => { clearTimeout(first); clearInterval(interval); };
  }, [generateMessage, visible]);

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] max-w-xs animate-slideInLeft">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] border-l-2 border-l-[#C9A84C] rounded-lg p-3 shadow-lg flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-white font-medium leading-snug">{message}</p>
          <p className="text-[9px] text-[#666] mt-1">Just now • Verified Purchase</p>
        </div>
        <button onClick={() => setVisible(false)} className="text-[#666] hover:text-white text-xs flex-shrink-0 mt-0.5">✕</button>
      </div>
    </div>
  );
}
