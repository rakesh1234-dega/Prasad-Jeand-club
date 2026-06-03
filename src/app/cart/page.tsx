'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function CartPage() {
  const cart = useStore((s) => s.cart);
  const coupons = useStore((s) => s.coupons);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateQty = useStore((s) => s.updateQty);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discount) / 100) : 0;
  const delivery = subtotal >= 999 ? 0 : 99;
  const total = subtotal - discountAmount + delivery;

  // Free shipping progress
  const shippingThreshold = 999;
  const shippingProgress = Math.min(100, (subtotal / shippingThreshold) * 100);
  const shippingRemaining = Math.max(0, shippingThreshold - subtotal);

  const handleApplyCoupon = () => {
    setCouponError('');
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.active);
    if (!found) { setCouponError('Invalid coupon code'); return; }
    if (new Date(found.expiry) < new Date()) { setCouponError('This coupon has expired'); return; }
    if (subtotal < found.minOrder) { setCouponError(`Minimum order ₹${found.minOrder} required`); return; }
    setAppliedCoupon({ code: found.code, discount: found.discount });
    setCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">🛒</span>
          <h2 className="font-display text-xl font-bold text-white">Your bag is empty</h2>
          <p className="text-[#666] text-sm mt-2">Add some items to get started</p>
          <Link href="/shop" className="btn-gold inline-block mt-5">START SHOPPING</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-white mb-6">Shopping Bag <span className="text-[#666] text-lg">({cart.reduce((s, i) => s + i.qty, 0)})</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Items - 60% */}
          <div className="lg:col-span-3 space-y-3">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="card rounded-lg p-4 flex gap-4">
                <div className="w-16 h-16 bg-[#222] rounded-md flex items-center justify-center text-2xl flex-shrink-0">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                  <p className="text-[10px] text-[#666] mt-0.5">Size: {item.size} • Color: <span className="inline-block w-3 h-3 rounded-full align-middle border border-[#333]" style={{ backgroundColor: item.color }}></span></p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.productId, item.qty - 1)} className="w-7 h-7 card rounded flex items-center justify-center text-xs text-white hover:border-[#C9A84C]">−</button>
                      <span className="text-xs font-bold text-white w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.productId, item.qty + 1)} className="w-7 h-7 card rounded flex items-center justify-center text-xs text-white hover:border-[#C9A84C]">+</button>
                    </div>
                    <span className="text-sm font-semibold text-[#C9A84C]">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="text-[#666] hover:text-[#E74C3C] text-xs self-start">✕</button>
              </div>
            ))}
          </div>

          {/* Sidebar - 40% */}
          <div className="lg:col-span-2">
            <div className="card rounded-lg p-5 sticky top-16 space-y-4">
              {/* Free Shipping Bar */}
              <div className="card rounded-md p-3">
                {subtotal >= shippingThreshold ? (
                  <p className="text-xs font-bold text-[#2ECC71]">🎉 You&apos;ve unlocked FREE shipping!</p>
                ) : (
                  <>
                    <p className="text-[11px] text-[#A0A0A0]">You&apos;re <strong className="text-[#C9A84C]">₹{shippingRemaining.toLocaleString()}</strong> away from FREE shipping!</p>
                    <div className="h-1.5 bg-[#2A2A2A] rounded-full mt-2 overflow-hidden">
                      <div className="h-full gradient-gold rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
                    </div>
                  </>
                )}
              </div>

              {/* Coupon */}
              <div>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon code" className="input flex-1 text-xs py-2" />
                    <button onClick={handleApplyCoupon} className="btn-gold-sm">APPLY</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-[rgba(46,204,113,0.08)] border border-[#2ECC71]/20 rounded-md px-3 py-2">
                    <div>
                      <span className="text-[#2ECC71] text-xs font-bold">✓ {appliedCoupon.code}</span>
                      <span className="text-[10px] text-[#A0A0A0] ml-2">−₹{discountAmount.toLocaleString()} saved!</span>
                    </div>
                    <button onClick={() => setAppliedCoupon(null)} className="text-[#666] text-xs hover:text-[#E74C3C]">✕</button>
                  </div>
                )}
                {couponError && <p className="text-[10px] text-[#E74C3C] mt-1">{couponError}</p>}
                {!appliedCoupon && <p className="text-[9px] text-[#666] mt-1">Try: FIRST15, PJC20, FLASH30</p>}
              </div>

              {/* Summary */}
              <div className="space-y-2 pt-3 border-t border-[#2A2A2A]">
                <div className="flex justify-between text-xs"><span className="text-[#A0A0A0]">Subtotal</span><span className="text-white">₹{subtotal.toLocaleString()}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-xs"><span className="text-[#2ECC71]">Discount ({appliedCoupon?.discount}%)</span><span className="text-[#2ECC71]">−₹{discountAmount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-xs"><span className="text-[#A0A0A0]">Delivery</span><span className={delivery === 0 ? 'text-[#2ECC71] font-bold' : 'text-white'}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-[#2A2A2A]"><span className="text-white">Total</span><span className="text-[#C9A84C]">₹{total.toLocaleString()}</span></div>
              </div>

              <Link href="/checkout" className="btn-gold w-full text-center block py-3.5">PROCEED TO CHECKOUT →</Link>
              <Link href="/shop" className="block text-center text-[11px] text-[#666] hover:text-[#A0A0A0]">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
