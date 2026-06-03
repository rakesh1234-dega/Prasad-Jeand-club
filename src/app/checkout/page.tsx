'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function CheckoutPage() {
  const cart = useStore((s) => s.cart);
  const router = useRouter();
  const [delivery, setDelivery] = useState<'standard' | 'express'>('standard');
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryCharge = delivery === 'express' ? 99 : (subtotal >= 999 ? 0 : 99);
  const total = subtotal + deliveryCharge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save address to localStorage for payment page
    localStorage.setItem('pjc_checkout_address', JSON.stringify(form));
    localStorage.setItem('pjc_checkout_delivery', delivery);
    router.push('/payment');
  };

  if (cart.length === 0) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="text-[#A0A0A0]">No items to checkout</p><Link href="/shop" className="btn-gold-sm mt-3 inline-block">Shop Now</Link></div></div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {['Address', 'Payment', 'Confirm'].map((step, i) => (
            <React.Fragment key={step}>
              <div className={`flex items-center gap-1.5 ${i === 0 ? 'text-[#C9A84C]' : 'text-[#666]'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'gradient-gold text-black' : 'bg-[#222] text-[#666]'}`}>{i + 1}</div>
                <span className="text-[11px] font-medium">{step}</span>
              </div>
              {i < 2 && <div className={`w-10 h-px ${i === 0 ? 'bg-[#C9A84C]' : 'bg-[#2A2A2A]'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="card rounded-lg p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-white">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Full Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input w-full" placeholder="Your name" /></div>
                <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required className="input w-full" placeholder="10-digit number" /></div>
              </div>
              <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Address</label><textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} required className="input w-full" rows={2} placeholder="House no, street, area" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">City</label><input value={form.city} onChange={e => setForm({...form, city: e.target.value})} required className="input w-full" /></div>
                <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">State</label><input value={form.state} onChange={e => setForm({...form, state: e.target.value})} required className="input w-full" /></div>
                <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Pincode</label><input value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} required maxLength={6} className="input w-full" /></div>
              </div>

              {/* Delivery */}
              <div className="pt-3">
                <h3 className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider mb-2">Delivery Option</h3>
                <div className="space-y-2">
                  <label className={`card rounded-md p-3 flex items-center justify-between cursor-pointer ${delivery === 'standard' ? 'border-[#C9A84C]' : ''}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="delivery" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} className="accent-[#C9A84C]" />
                      <div><p className="text-xs font-medium text-white">Standard</p><p className="text-[10px] text-[#666]">3–5 business days</p></div>
                    </div>
                    <span className="text-xs font-bold text-[#2ECC71]">{subtotal >= 999 ? 'FREE' : '₹99'}</span>
                  </label>
                  <label className={`card rounded-md p-3 flex items-center justify-between cursor-pointer ${delivery === 'express' ? 'border-[#C9A84C]' : ''}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="delivery" checked={delivery === 'express'} onChange={() => setDelivery('express')} className="accent-[#C9A84C]" />
                      <div><p className="text-xs font-medium text-white">Express</p><p className="text-[10px] text-[#666]">1–2 business days</p></div>
                    </div>
                    <span className="text-xs font-bold text-white">₹99</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-gold w-full py-3.5 mt-2">CONTINUE TO PAYMENT →</button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="card rounded-lg p-5 sticky top-16">
              <h3 className="text-xs font-bold text-white mb-3">Order Summary ({cart.length} items)</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                {cart.map(item => (
                  <div key={item.productId} className="flex gap-2 text-[11px]">
                    <span className="text-lg">{item.emoji}</span>
                    <div className="flex-1 min-w-0"><p className="truncate text-white">{item.name}</p><p className="text-[#666]">Qty: {item.qty} • {item.size}</p></div>
                    <span className="text-[#C9A84C] font-medium">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 pt-3 border-t border-[#2A2A2A] text-xs">
                <div className="flex justify-between"><span className="text-[#A0A0A0]">Subtotal</span><span className="text-white">₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#A0A0A0]">Delivery</span><span className={deliveryCharge === 0 ? 'text-[#2ECC71]' : 'text-white'}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#2A2A2A]"><span className="text-white">Total</span><span className="text-[#C9A84C]">₹{total.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
