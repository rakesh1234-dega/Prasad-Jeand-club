'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function PaymentPage() {
  const cart = useStore((s) => s.cart);
  const addOrder = useStore((s) => s.addOrder);
  const clearCart = useStore((s) => s.clearCart);
  const router = useRouter();
  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryType = typeof window !== 'undefined' ? localStorage.getItem('pjc_checkout_delivery') || 'standard' : 'standard';
  const delivery = deliveryType === 'express' ? 99 : (subtotal >= 999 ? 0 : 99);
  const codCharge = method === 'cod' ? 40 : 0;
  const total = subtotal + delivery + codCharge;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      const address = JSON.parse(localStorage.getItem('pjc_checkout_address') || '{}');
      const order = {
        id: `PJC${Math.floor(100000 + Math.random() * 900000)}`,
        items: cart,
        total,
        status: 'placed',
        address,
        payment: method,
        createdAt: new Date().toISOString(),
      };
      addOrder(order);
      clearCart();
      localStorage.removeItem('pjc_checkout_address');
      localStorage.removeItem('pjc_checkout_delivery');
      localStorage.setItem('pjc_last_order_id', order.id);
      router.push('/order-success');
    }, 1500);
  };

  if (cart.length === 0) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="text-[#A0A0A0]">No items</p><Link href="/shop" className="btn-gold-sm mt-3 inline-block">Shop</Link></div></div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {['Address', 'Payment', 'Confirm'].map((step, i) => (
            <React.Fragment key={step}>
              <div className={`flex items-center gap-1.5 ${i <= 1 ? 'text-[#C9A84C]' : 'text-[#666]'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= 1 ? 'gradient-gold text-black' : 'bg-[#222] text-[#666]'}`}>{i < 1 ? '✓' : i + 1}</div>
                <span className="text-[11px] font-medium">{step}</span>
              </div>
              {i < 2 && <div className={`w-10 h-px ${i < 1 ? 'bg-[#C9A84C]' : 'bg-[#2A2A2A]'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-3">
            <h2 className="font-display text-lg font-bold text-white mb-4">Payment Method</h2>

            {/* UPI */}
            <label className={`card rounded-lg p-4 flex items-center gap-4 cursor-pointer ${method === 'upi' ? 'border-[#C9A84C]' : ''}`}>
              <input type="radio" name="pay" value="upi" checked={method === 'upi'} onChange={() => setMethod('upi')} className="accent-[#C9A84C]" />
              <div className="w-9 h-9 bg-[#2ECC71]/10 rounded-lg flex items-center justify-center"><span className="text-lg">📱</span></div>
              <div className="flex-1"><p className="text-xs font-bold text-white">UPI</p><p className="text-[10px] text-[#666]">GPay, PhonePe, Paytm</p></div>
              <span className="badge-new">RECOMMENDED</span>
            </label>
            {method === 'upi' && (
              <div className="ml-12 card rounded-md p-3"><input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className="input w-full text-xs" /></div>
            )}

            {/* Card */}
            <label className={`card rounded-lg p-4 flex items-center gap-4 cursor-pointer ${method === 'card' ? 'border-[#C9A84C]' : ''}`}>
              <input type="radio" name="pay" value="card" checked={method === 'card'} onChange={() => setMethod('card')} className="accent-[#C9A84C]" />
              <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center"><span className="text-lg">💳</span></div>
              <div className="flex-1"><p className="text-xs font-bold text-white">Credit / Debit Card</p><p className="text-[10px] text-[#666]">Visa, Mastercard, RuPay</p></div>
            </label>
            {method === 'card' && (
              <div className="ml-12 card rounded-md p-3 space-y-2">
                <input placeholder="Card number" className="input w-full text-xs" />
                <div className="flex gap-2"><input placeholder="MM/YY" className="input flex-1 text-xs" /><input placeholder="CVV" className="input w-20 text-xs" /></div>
              </div>
            )}

            {/* Net Banking */}
            <label className={`card rounded-lg p-4 flex items-center gap-4 cursor-pointer ${method === 'netbanking' ? 'border-[#C9A84C]' : ''}`}>
              <input type="radio" name="pay" value="netbanking" checked={method === 'netbanking'} onChange={() => setMethod('netbanking')} className="accent-[#C9A84C]" />
              <div className="w-9 h-9 bg-purple-500/10 rounded-lg flex items-center justify-center"><span className="text-lg">🏦</span></div>
              <div className="flex-1"><p className="text-xs font-bold text-white">Net Banking</p><p className="text-[10px] text-[#666]">All major banks</p></div>
            </label>

            {/* COD */}
            <label className={`card rounded-lg p-4 flex items-center gap-4 cursor-pointer ${method === 'cod' ? 'border-[#C9A84C]' : ''}`}>
              <input type="radio" name="pay" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} className="accent-[#C9A84C]" />
              <div className="w-9 h-9 bg-[#F39C12]/10 rounded-lg flex items-center justify-center"><span className="text-lg">💰</span></div>
              <div className="flex-1"><p className="text-xs font-bold text-white">Cash on Delivery</p><p className="text-[10px] text-[#666]">Pay when delivered</p></div>
              <span className="text-[9px] font-bold text-[#F39C12] bg-[#F39C12]/10 px-2 py-0.5 rounded">+₹40</span>
            </label>

            {/* Security */}
            <div className="flex items-center gap-2 p-3 bg-[#2ECC71]/5 border border-[#2ECC71]/10 rounded-lg">
              <span className="text-lg">🔒</span>
              <p className="text-[10px] text-[#2ECC71]"><strong>100% Secure Payment</strong> — SSL Encrypted</p>
            </div>

            <button onClick={handlePay} disabled={processing} className={`w-full py-4 rounded font-bold text-sm uppercase tracking-wider transition-all ${processing ? 'bg-[#333] text-[#666] cursor-not-allowed' : 'gradient-gold text-black hover:opacity-90'}`}>
              {processing ? (
                <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Processing...</span>
              ) : `PAY ₹${total.toLocaleString()}`}
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="card rounded-lg p-5 sticky top-16">
              <h3 className="text-xs font-bold text-white mb-3">Order Summary</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-[#A0A0A0]">Subtotal</span><span className="text-white">₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#A0A0A0]">Delivery</span><span className={delivery === 0 ? 'text-[#2ECC71]' : 'text-white'}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                {codCharge > 0 && <div className="flex justify-between"><span className="text-[#A0A0A0]">COD Charge</span><span className="text-white">₹{codCharge}</span></div>}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-[#2A2A2A]"><span className="text-white">Total</span><span className="text-[#C9A84C]">₹{total.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
