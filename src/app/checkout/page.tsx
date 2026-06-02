'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, getTotal, getSubtotal, couponDiscount } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: '', phone: '', address: '', city: '', state: '', pincode: '',
  });
  const [delivery, setDelivery] = useState('standard');

  const deliveryCharge = getSubtotal() >= 999 ? 0 : 99;
  const expressCharge = 99;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save address
    const addresses = JSON.parse(localStorage.getItem('pjc_addresses') || '[]');
    addresses.push({ ...address, id: Date.now().toString(), isDefault: true });
    localStorage.setItem('pjc_addresses', JSON.stringify(addresses));
    setStep(2);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No items to checkout</h2>
          <Link href="/shop" className="mt-4 inline-block px-6 py-2 bg-secondary text-white rounded-lg">Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Confirm' },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={`flex items-center gap-2 ${step >= s.num ? 'text-secondary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
              </div>
              {i < 2 && <div className={`w-16 md:w-24 h-0.5 mx-2 ${step > s.num ? 'bg-secondary' : 'bg-gray-200'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h2 className="text-lg font-poppins font-semibold mb-4">Shipping Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                      <input type="text" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" placeholder="Enter full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                      <input type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" placeholder="10-digit number" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
                    <textarea value={address.address} onChange={e => setAddress({...address, address: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" rows={3} placeholder="House No, Building, Street, Area" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">City</label>
                      <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">State</label>
                      <input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">PIN Code</label>
                      <input type="text" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" maxLength={6} />
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Delivery Option</h4>
                    <div className="space-y-2">
                      <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${delivery === 'standard' ? 'border-secondary bg-secondary/5' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="delivery" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} className="text-secondary" />
                          <div>
                            <p className="text-sm font-medium">Standard Delivery</p>
                            <p className="text-xs text-gray-500">5-7 business days</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-600">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                      </label>
                      <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${delivery === 'express' ? 'border-secondary bg-secondary/5' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="delivery" checked={delivery === 'express'} onChange={() => setDelivery('express')} className="text-secondary" />
                          <div>
                            <p className="text-sm font-medium">Express Delivery</p>
                            <p className="text-xs text-gray-500">2-3 business days</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">₹{expressCharge}</span>
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="w-full mt-4 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-colors">
                    Continue to Payment →
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h2 className="text-lg font-poppins font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: '📱' },
                    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                    { id: 'cod', label: 'Cash on Delivery (+₹40)', icon: '💰' },
                  ].map(method => (
                    <label key={method.id} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-secondary transition-colors">
                      <input type="radio" name="payment" className="text-secondary" />
                      <span className="text-xl">{method.icon}</span>
                      <span className="text-sm font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50">
                    ← Back
                  </button>
                  <button onClick={() => router.push('/order-success')} className="flex-1 py-3 bg-gradient-to-r from-secondary to-secondary-dark text-white font-semibold rounded-xl hover:shadow-lg">
                    Pay ₹{(getTotal() + (delivery === 'express' ? expressCharge : deliveryCharge)).toLocaleString()} →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-card sticky top-20">
              <h3 className="font-semibold text-sm mb-3">Order Summary ({items.length} items)</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-2 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-lg flex-shrink-0">
                      {item.product.category === 'jeans' ? '👖' : '👕'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs">{item.product.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} | {item.size}</p>
                    </div>
                    <span className="text-xs font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{getSubtotal().toLocaleString()}</span></div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{((getSubtotal() * couponDiscount) / 100).toLocaleString()}</span></div>
                )}
                <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span>{delivery === 'express' ? `₹${expressCharge}` : (deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`)}</span></div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span>₹{(getTotal() + (delivery === 'express' ? expressCharge : deliveryCharge)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
