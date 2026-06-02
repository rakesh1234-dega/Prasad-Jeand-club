'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export default function PaymentPage() {
  const { items, getTotal, getSubtotal, couponDiscount, clearCart } = useCart();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');

  const deliveryCharge = getSubtotal() >= 999 ? 0 : 99;
  const codCharge = selectedMethod === 'cod' ? 40 : 0;
  const totalAmount = getTotal() + deliveryCharge + codCharge;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Save order
      const orders = JSON.parse(localStorage.getItem('pjc_orders') || '[]');
      const orderId = `PJC-${Date.now().toString().slice(-8)}`;
      orders.unshift({
        id: orderId,
        items: items,
        total: totalAmount,
        status: 'placed',
        paymentMethod: selectedMethod,
        createdAt: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      localStorage.setItem('pjc_orders', JSON.stringify(orders));
      clearCart();
      router.push('/order-success');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-6xl block mb-4">🛒</span>
          <h2 className="text-xl font-poppins font-bold text-gray-800 mb-2">No items to pay for</h2>
          <p className="text-gray-500 text-sm mb-6">Your cart is empty</p>
          <Link href="/shop" className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg text-sm">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/checkout" className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Checkout
        </Link>
        
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-1">Payment</h1>
        <p className="text-sm text-gray-500 mb-8">Choose your payment method</p>

        <form onSubmit={handlePayment}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-4">
              {/* UPI */}
              <label className={`flex items-center gap-4 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-red-500 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value="upi" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="w-4 h-4 text-red-600" />
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><span className="text-xl">📱</span></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">UPI</p>
                  <p className="text-xs text-gray-500">GPay, PhonePe, Paytm, BHIM</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">Recommended</span>
              </label>

              {selectedMethod === 'upi' && (
                <div className="ml-8 p-4 bg-white rounded-lg border border-gray-200">
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">UPI ID</label>
                  <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500" required />
                </div>
              )}

              {/* Card */}
              <label className={`flex items-center gap-4 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-red-500 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="w-4 h-4 text-red-600" />
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><span className="text-xl">💳</span></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">Credit / Debit Card</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                </div>
              </label>

              {/* Net Banking */}
              <label className={`flex items-center gap-4 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'netbanking' ? 'border-red-500 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value="netbanking" checked={selectedMethod === 'netbanking'} onChange={() => setSelectedMethod('netbanking')} className="w-4 h-4 text-red-600" />
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><span className="text-xl">🏦</span></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">Net Banking</p>
                  <p className="text-xs text-gray-500">All major banks</p>
                </div>
              </label>

              {/* COD */}
              <label className={`flex items-center gap-4 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'cod' ? 'border-red-500 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value="cod" checked={selectedMethod === 'cod'} onChange={() => setSelectedMethod('cod')} className="w-4 h-4 text-red-600" />
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><span className="text-xl">💰</span></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when you receive (+₹40)</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold">+₹40</span>
              </label>

              {/* Security */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <div>
                  <p className="text-xs font-semibold text-green-800">100% Secure Payment</p>
                  <p className="text-[10px] text-green-600">Your information is encrypted & safe</p>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'}`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Processing Payment...
                  </span>
                ) : (
                  `PAY ₹${totalAmount.toLocaleString()}`
                )}
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-5 border border-gray-200 sticky top-20">
                <h3 className="font-semibold text-sm text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                  {items.map(item => (
                    <div key={`${item.product.id}-${item.size}`} className="flex gap-2 text-xs">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg flex-shrink-0">
                        {item.product.category === 'jeans' ? '👖' : '👕'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{item.product.name}</p>
                        <p className="text-gray-400">Qty: {item.quantity} | {item.size}</p>
                      </div>
                      <span className="font-semibold whitespace-nowrap">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{getSubtotal().toLocaleString()}</span></div>
                  {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{((getSubtotal() * couponDiscount) / 100).toLocaleString()}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className={deliveryCharge === 0 ? 'text-green-600' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
                  {codCharge > 0 && <div className="flex justify-between"><span className="text-gray-500">COD Charge</span><span>₹{codCharge}</span></div>}
                  <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span className="text-red-600">₹{totalAmount.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
