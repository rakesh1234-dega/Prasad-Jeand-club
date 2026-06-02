'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';

export default function OrderSuccessPage() {
  const { clearCart, items, getTotal } = useCart();
  const { addNotification } = useNotifications();
  const orderId = `PJC-${Date.now().toString().slice(-8)}`;

  useEffect(() => {
    // Save order
    const orders = JSON.parse(localStorage.getItem('pjc_orders') || '[]');
    orders.unshift({
      id: orderId,
      items: items,
      total: getTotal(),
      status: 'placed',
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    localStorage.setItem('pjc_orders', JSON.stringify(orders));

    // Add notification
    addNotification({
      title: 'Order Placed Successfully!',
      message: `Your order #${orderId} has been placed. Expected delivery in 5-7 days.`,
      type: 'order',
    });

    // Clear cart
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl p-8 shadow-card text-center">
          {/* Success Animation */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce-in">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-poppins font-bold text-primary mt-6">Order Placed!</h1>
          <p className="text-gray-500 mt-2">Your order has been placed successfully</p>

          <div className="bg-gray-50 rounded-xl p-4 mt-6">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-lg font-bold text-primary font-mono">#{orderId}</p>
          </div>

          <div className="space-y-2 mt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Expected Delivery</span>
              <span className="font-medium">5-7 business days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <Link href="/orders" className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors">
              Track Order
            </Link>
            <Link href="/shop" className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
