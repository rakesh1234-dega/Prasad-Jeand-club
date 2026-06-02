'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  method?: {
    upi?: boolean;
    card?: boolean;
    netbanking?: boolean;
    wallet?: boolean;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export default function PaymentPage() {
  const { items, getTotal, getSubtotal, couponDiscount, clearCart } = useCart();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<{ name: string; phone: string; email: string } | null>(null);

  const deliveryCharge = getSubtotal() >= 999 ? 0 : 99;
  const totalAmount = getTotal() + deliveryCharge;

  // Load address from localStorage
  useEffect(() => {
    const savedAddresses = localStorage.getItem('pjc_addresses');
    if (savedAddresses) {
      try {
        const addresses = JSON.parse(savedAddresses);
        const defaultAddr = addresses.find((a: { isDefault: boolean }) => a.isDefault) || addresses[0];
        if (defaultAddr) {
          setAddress({
            name: defaultAddr.name || 'Customer',
            phone: defaultAddr.phone || '',
            email: defaultAddr.email || 'customer@prasadjeans.com',
          });
        }
      } catch {
        // ignore parse error
      }
    }
    if (!address) {
      const savedUser = localStorage.getItem('pjc_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setAddress({
            name: user.name || 'Customer',
            phone: user.phone || '',
            email: user.email || 'customer@prasadjeans.com',
          });
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Load Razorpay script
  useEffect(() => {
    if (document.getElementById('razorpay-script')) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => setError('Failed to load payment gateway. Please refresh.');
    document.body.appendChild(script);

    return () => {
      // Cleanup not needed for script tags
    };
  }, []);

  const handleRazorpayPayment = useCallback(async () => {
    if (!isScriptLoaded) {
      setError('Payment gateway is loading. Please wait...');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create order on server
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            items_count: String(items.length),
            customer_name: address?.name || 'Customer',
          },
        }),
      });

      const data = await response.json();

      if (!data.success || !data.order) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: 'rzp_test_SwnmKZJdburTcD',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Prasad Jeans Club',
        description: `Order of ${items.length} item${items.length > 1 ? 's' : ''}`,
        order_id: data.order.id,
        handler: async (response: RazorpayResponse) => {
          // Verify payment on server
          try {
            const verifyRes = await fetch('/api/payment', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Store order info for success page
              localStorage.setItem('pjc_last_order', JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: totalAmount,
                items: items.length,
                date: new Date().toISOString(),
                method: selectedMethod,
              }));
              clearCart();
              router.push('/order-success');
            } else {
              setError('Payment verification failed. Please contact support.');
              setIsProcessing(false);
            }
          } catch {
            setError('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: address?.name || 'Customer',
          email: address?.email || 'customer@prasadjeans.com',
          contact: address?.phone || '',
        },
        notes: {
          items_count: String(items.length),
        },
        theme: {
          color: '#e94560',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        method: {
          upi: selectedMethod === 'upi',
          card: selectedMethod === 'card',
          netbanking: selectedMethod === 'netbanking',
          wallet: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: unknown) => {
        const failedResponse = response as { error?: { description?: string } };
        setError(failedResponse?.error?.description || 'Payment failed. Please try again.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
      setIsProcessing(false);
    }
  }, [isScriptLoaded, totalAmount, items, address, selectedMethod, clearCart, router]);

  const handleCODPayment = () => {
    setIsProcessing(true);
    setError(null);

    // Simulate COD order placement
    setTimeout(() => {
      localStorage.setItem('pjc_last_order', JSON.stringify({
        orderId: `COD_${Date.now()}`,
        paymentId: null,
        amount: totalAmount + 40, // COD charge
        items: items.length,
        date: new Date().toISOString(),
        method: 'cod',
      }));
      clearCart();
      router.push('/order-success');
    }, 1500);
  };

  const handlePayment = () => {
    if (selectedMethod === 'cod') {
      handleCODPayment();
    } else {
      handleRazorpayPayment();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-2">
            No items to pay for
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Your cart is empty. Add some items before proceeding to payment.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-secondary text-white font-medium rounded-xl hover:bg-opacity-90 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/checkout" className="text-sm text-gray-500 hover:text-secondary transition-colors flex items-center gap-1 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Checkout
          </Link>
          <h1 className="text-2xl font-poppins font-bold text-primary">
            Complete Payment
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Choose your preferred payment method
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-red-700 font-medium">Payment Error</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-poppins font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Select Payment Method
              </h2>

              <div className="space-y-3">
                {/* UPI */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-secondary bg-secondary/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={selectedMethod === 'upi'}
                    onChange={() => setSelectedMethod('upi')}
                    className="w-4 h-4 text-secondary focus:ring-secondary"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">UPI</p>
                      <p className="text-xs text-gray-500">GPay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    Recommended
                  </span>
                </label>

                {/* Credit/Debit Card */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedMethod === 'card'
                      ? 'border-secondary bg-secondary/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={selectedMethod === 'card'}
                    onChange={() => setSelectedMethod('card')}
                    className="w-4 h-4 text-secondary focus:ring-secondary"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">💳</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Credit / Debit Card</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                </label>

                {/* Net Banking */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'border-secondary bg-secondary/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={selectedMethod === 'netbanking'}
                    onChange={() => setSelectedMethod('netbanking')}
                    className="w-4 h-4 text-secondary focus:ring-secondary"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🏦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Net Banking</p>
                      <p className="text-xs text-gray-500">All major banks supported</p>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedMethod === 'cod'
                      ? 'border-secondary bg-secondary/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={selectedMethod === 'cod'}
                    onChange={() => setSelectedMethod('cod')}
                    className="w-4 h-4 text-secondary focus:ring-secondary"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">💰</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when you receive (+₹40 COD charge)</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                    +₹40
                  </span>
                </label>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">100% Secure Payment</p>
                  <p className="text-xs text-gray-500">
                    Encrypted & secured by Razorpay. Your data is safe.
                  </p>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || (!isScriptLoaded && selectedMethod !== 'cod')}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                isProcessing || (!isScriptLoaded && selectedMethod !== 'cod')
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-secondary to-pink-600 text-white hover:shadow-lg hover:shadow-secondary/30 active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : selectedMethod === 'cod' ? (
                `Place Order - ₹${(totalAmount + 40).toLocaleString()}`
              ) : (
                `Pay ₹${totalAmount.toLocaleString()}`
              )}
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-20">
              <h3 className="font-poppins font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-3 max-h-52 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                      {item.product.category === 'jeans' ? '👖' : item.product.category === 'shirts' ? '👔' : '👕'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.size} | {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
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
                  <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                {selectedMethod === 'cod' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">COD Charge</span>
                    <span className="font-medium">₹40</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
                  <span className="text-gray-800">Total</span>
                  <span className="text-secondary">
                    ₹{(selectedMethod === 'cod' ? totalAmount + 40 : totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Savings */}
              {couponDiscount > 0 && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700 font-medium text-center">
                    🎉 You are saving ₹{((getSubtotal() * couponDiscount) / 100).toLocaleString()} on this order!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
