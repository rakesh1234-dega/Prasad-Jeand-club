'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('pjc_last_order_id') || `PJC${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(id);
    localStorage.removeItem('pjc_last_order_id');
    localStorage.removeItem('pjc_cart_abandoned');
  }, []);

  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card rounded-xl p-8 max-w-sm w-full text-center animate-fadeIn">
        {/* Animated Checkmark */}
        <div className="w-20 h-20 mx-auto bg-[#2ECC71]/10 rounded-full flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-[#2ECC71]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path className="animate-drawCheck" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display text-2xl font-bold text-[#C9A84C]">Order Placed! 🎉</h1>
        <p className="text-[#A0A0A0] text-sm mt-2">Your order has been placed successfully</p>

        <div className="card rounded-md p-3 mt-5">
          <p className="text-[10px] text-[#666] uppercase tracking-wider">Order ID</p>
          <p className="text-lg font-bold text-white font-body tracking-wider">#{orderId}</p>
        </div>

        <div className="text-xs text-[#A0A0A0] mt-4 space-y-1">
          <p>Expected delivery: <strong className="text-white">{deliveryDate}</strong></p>
          <p>Payment: <strong className="text-[#2ECC71]">Confirmed ✓</strong></p>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <Link href="/orders" className="btn-gold-outline w-full text-center block py-3">TRACK ORDER</Link>
          <Link href="/shop" className="btn-gold w-full text-center block py-3">CONTINUE SHOPPING</Link>
        </div>
      </div>
    </div>
  );
}
