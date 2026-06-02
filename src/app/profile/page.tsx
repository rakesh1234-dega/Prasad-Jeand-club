'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const orders = JSON.parse(localStorage.getItem('pjc_orders') || '[]');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-poppins font-bold text-primary">{user?.name}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-sm text-gray-400">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'personal', label: 'Personal Details', icon: '👤' },
            { id: 'orders', label: 'My Orders', icon: '📦' },
            { id: 'addresses', label: 'Addresses', icon: '📍' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h2 className="font-poppins font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs text-gray-500">Full Name</label>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs text-gray-500">Phone</label>
                  <p className="font-medium">{user?.phone || 'Not added'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs text-gray-500">Member Since</label>
                  <p className="font-medium">2024</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <button onClick={() => { logout(); router.push('/login'); }} className="px-6 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 text-sm font-medium">
                  Logout
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="font-poppins font-semibold mb-4">Recent Orders</h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Order #{order.id}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          order.status === 'placed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold mt-2">₹{order.total?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl">📦</span>
                  <p className="text-gray-500 mt-2">No orders yet</p>
                  <Link href="/shop" className="inline-block mt-3 text-sm text-secondary font-medium">Start Shopping →</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="font-poppins font-semibold mb-4">Saved Addresses</h2>
              {(() => {
                const addresses = JSON.parse(localStorage.getItem('pjc_addresses') || '[]');
                return addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr: any) => (
                      <div key={addr.id} className="border rounded-lg p-4">
                        <p className="font-medium text-sm">{addr.name}</p>
                        <p className="text-sm text-gray-600">{addr.address}</p>
                        <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-sm text-gray-400">{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl">📍</span>
                    <p className="text-gray-500 mt-2">No saved addresses</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
