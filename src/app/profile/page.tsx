'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function ProfilePage() {
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const setUser = useStore((s) => s.setUser);
  const router = useRouter();

  if (!user) { router.push('/login'); return null; }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="card rounded-xl p-6 flex items-center gap-4 mb-6">
          <div className="w-14 h-14 gradient-gold rounded-full flex items-center justify-center"><span className="text-black text-xl font-bold">{user.name.charAt(0)}</span></div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">{user.name}</h1>
            <p className="text-xs text-[#A0A0A0]">{user.email}</p>
            <span className="text-[9px] text-[#2ECC71] font-bold">Verified ✓</span>
          </div>
        </div>

        {/* Info */}
        <div className="card rounded-xl p-6 mb-6">
          <h2 className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[{l:'Name',v:user.name},{l:'Email',v:user.email},{l:'Phone',v:user.phone},{l:'Member Since',v:'2024'}].map(i=>(
              <div key={i.l} className="bg-[#222] rounded-md p-3"><p className="text-[9px] text-[#666] uppercase">{i.l}</p><p className="text-xs text-white mt-0.5">{i.v}</p></div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">Recent Orders</h2>
            <Link href="/orders" className="text-[10px] text-[#C9A84C]">View All →</Link>
          </div>
          {orders.length > 0 ? orders.slice(0, 3).map(o => (
            <div key={o.id} className="bg-[#222] rounded-md p-3 mb-2 flex items-center justify-between">
              <div><p className="text-xs font-bold text-white">#{o.id}</p><p className="text-[9px] text-[#666]">{new Date(o.createdAt).toLocaleDateString()}</p></div>
              <div className="text-right"><p className="text-xs font-bold text-[#C9A84C]">₹{o.total.toLocaleString()}</p><span className="text-[9px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-1.5 py-0.5 rounded capitalize">{o.status}</span></div>
            </div>
          )) : <p className="text-xs text-[#666] text-center py-4">No orders yet</p>}
        </div>

        <button onClick={() => { setUser(null); router.push('/'); }} className="btn-gold-outline w-full text-center py-3">LOGOUT</button>
      </div>
    </div>
  );
}
