'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getSubtotal, getTotal, applyCoupon, appliedCoupon, couponDiscount, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (success) {
      if ((window as any).__pjcToast) (window as any).__pjcToast('Coupon applied!', 'success');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const deliveryCharge = getSubtotal() >= 999 ? 0 : 99;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-8xl">🛒</span>
          <h2 className="text-2xl font-poppins font-bold text-primary mt-6">Your Cart is Empty</h2>
          <p className="text-gray-500 mt-2">Looks like you haven&apos;t added anything yet</p>
          <Link href="/shop" className="inline-block mt-6 px-8 py-3 bg-secondary text-white font-medium rounded-xl hover:bg-secondary-dark transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-poppins font-bold text-primary mb-6">
          My Cart <span className="text-gray-400 text-lg">({itemCount} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="bg-white rounded-xl p-4 shadow-card flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl opacity-50">
                    {item.product.category === 'jeans' ? '👖' : item.product.category === 'tshirts' ? '👕' : '👔'}
                  </span>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-medium text-gray-800 truncate">{item.product.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Size: {item.size} | Color: <span className="inline-block w-3 h-3 rounded-full align-middle" style={{ backgroundColor: item.color }}></span></p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">₹{item.product.price.toLocaleString()}</span>
                    {item.product.oldPrice > item.product.price && (
                      <span className="text-sm text-gray-400 line-through">₹{item.product.oldPrice.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                      className="text-xs text-red-500 font-medium hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-card sticky top-20">
              <h3 className="font-poppins font-semibold text-primary mb-4">Order Summary</h3>

              {/* Coupon */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-green-600 mt-1">✓ {appliedCoupon} applied ({couponDiscount}% off)</p>
                )}
                {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                <p className="text-[10px] text-gray-400 mt-1">Try: PRASAD10, PRASAD20, FIRST50</p>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getSubtotal().toLocaleString()}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount ({couponDiscount}%)</span>
                    <span>-₹{((getSubtotal() * couponDiscount) / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span className="text-primary">₹{(getTotal() + deliveryCharge).toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full mt-6 py-3 bg-gradient-to-r from-secondary to-secondary-dark text-white font-semibold text-center rounded-xl hover:shadow-lg transition-all"
              >
                Proceed to Checkout →
              </Link>

              <Link href="/shop" className="block text-center text-sm text-gray-500 mt-3 hover:text-secondary">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
