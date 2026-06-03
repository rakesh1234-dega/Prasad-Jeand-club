'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

const statusColors: Record<string, string> = {
  placed: 'bg-[#C9A84C]/10 text-[#C9A84C]',
  confirmed: 'bg-blue-500/10 text-blue-400',
  shipped: 'bg-[#F39C12]/10 text-[#F39C12]',
  delivered: 'bg-[#2ECC71]/10 text-[#2ECC71]',
  cancelled: 'bg-[#E74C3C]/10 text-[#E74C3C]',
};

const steps = ['placed', 'confirmed', 'shipped', 'delivered'];

export default function OrdersPage() {
  const orders = useStore((s) => s.orders);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">📦</span>
          <h2 className="font-display text-xl font-bold text-white">No orders yet</h2>
          <p className="text-[#666] text-sm mt-2">Your order history will appear here</p>
          <Link href="/shop" className="btn-gold inline-block mt-5">START SHOPPING</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-white mb-6">My Orders</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap ${tab === t ? 'bg-[#C9A84C] text-black' : 'bg-[#1A1A1A] text-[#A0A0A0] hover:text-white'}`}>
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-3">
          {filtered.map(order => {
            const currentStep = steps.indexOf(order.status);
            return (
              <div key={order.id} className="card rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-white">#{order.id}</p>
                    <p className="text-[10px] text-[#666]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded ${statusColors[order.status] || 'text-[#666]'}`}>{order.status}</span>
                </div>

                {/* Items */}
                <div className="flex gap-1.5 mb-3 overflow-x-auto">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="w-10 h-10 bg-[#222] rounded flex items-center justify-center text-lg flex-shrink-0">{item.emoji}</div>
                  ))}
                  {order.items.length > 4 && <div className="w-10 h-10 bg-[#222] rounded flex items-center justify-center text-[9px] text-[#666] flex-shrink-0">+{order.items.length - 4}</div>}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#C9A84C]">₹{order.total.toLocaleString()}</span>
                  {order.status === 'placed' && (
                    <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="text-[10px] text-[#E74C3C] font-medium border border-[#E74C3C]/20 px-2 py-1 rounded hover:bg-[#E74C3C]/10">CANCEL</button>
                  )}
                </div>

                {/* Tracking */}
                {order.status !== 'cancelled' && (
                  <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
                    <div className="flex items-center justify-between">
                      {steps.map((s, i) => (
                        <div key={s} className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${i <= currentStep ? 'gradient-gold text-black' : 'bg-[#222] text-[#666]'}`}>
                            {i <= currentStep ? '✓' : i + 1}
                          </div>
                          <span className="text-[8px] text-[#666] mt-1 capitalize">{s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="relative h-1 bg-[#2A2A2A] rounded-full mt-2 mx-2">
                      <div className="absolute top-0 left-0 h-full gradient-gold rounded-full transition-all" style={{ width: `${(currentStep / 3) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
