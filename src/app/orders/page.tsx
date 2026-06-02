'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pjc_orders') || '[]');
    setOrders(saved);
  }, []);

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-8xl">📋</span>
          <h2 className="text-2xl font-poppins font-bold text-primary mt-6">No Orders Yet</h2>
          <p className="text-gray-500 mt-2">Your order history will appear here</p>
          <Link href="/shop" className="inline-block mt-6 px-8 py-3 bg-secondary text-white font-medium rounded-xl">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-poppins font-bold text-primary mb-6">My Orders</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'placed', 'shipped', 'delivered', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize whitespace-nowrap ${
                activeTab === tab ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === 'all' ? 'All Orders' : tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-sm">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                  order.status === 'placed' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items Preview */}
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {order.items?.slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {item.product?.category === 'jeans' ? '👖' : '👕'}
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="font-bold">₹{order.total?.toLocaleString()}</span>
                <div className="flex gap-2">
                  {order.status === 'placed' && (
                    <button className="text-xs text-red-500 font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Order Tracking */}
              {order.status !== 'cancelled' && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    {['Placed', 'Confirmed', 'Shipped', 'Delivered'].map((step, i) => {
                      const stepMap: Record<string, number> = { placed: 0, confirmed: 1, shipped: 2, delivered: 3 };
                      const currentStep = stepMap[order.status] || 0;
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            i <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {i <= currentStep ? '✓' : i + 1}
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1">{step}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="relative mt-1 h-1 bg-gray-200 rounded-full mx-3">
                    <div
                      className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${((['placed', 'confirmed', 'shipped', 'delivered'].indexOf(order.status)) / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
