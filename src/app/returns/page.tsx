'use client';

import React from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-poppins font-bold text-white">Return & Refund Policy</h1>
          <p className="text-gray-300 mt-2">Easy returns, hassle-free refunds</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Return Policy */}
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-xl font-poppins font-bold text-primary mb-4">Return Policy</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-700 font-medium">✓ 7-Day Easy Return Window</p>
            <p className="text-green-600 text-sm mt-1">Return any product within 7 days of delivery for a full refund</p>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, you can return it within 7 days of delivery.
          </p>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-xl font-poppins font-bold text-primary mb-6">How to Return</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Initiate Return', desc: 'Go to My Orders → Select Order → Click Return' },
              { step: 2, title: 'Pack the Product', desc: 'Pack the item in original packaging with tags attached' },
              { step: 3, title: 'Pickup Scheduled', desc: 'Our courier will pick up within 48 hours' },
              { step: 4, title: 'Refund Processed', desc: 'Refund within 5-7 business days after quality check' },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Timeline */}
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-xl font-poppins font-bold text-primary mb-4">Refund Timeline</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-medium">Payment Method</th>
                  <th className="text-left p-3 font-medium">Refund Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t"><td className="p-3">UPI</td><td className="p-3">2-3 business days</td></tr>
                <tr className="border-t"><td className="p-3">Credit/Debit Card</td><td className="p-3">5-7 business days</td></tr>
                <tr className="border-t"><td className="p-3">Net Banking</td><td className="p-3">5-7 business days</td></tr>
                <tr className="border-t"><td className="p-3">Cash on Delivery</td><td className="p-3">7-10 business days (bank transfer)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-xl font-poppins font-bold text-primary mb-4">Return Conditions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-700 text-sm mb-2">✓ Eligible for Return</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Wrong size delivered</li>
                <li>• Defective or damaged product</li>
                <li>• Different product received</li>
                <li>• Quality not as expected</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-medium text-red-700 text-sm mb-2">✕ Not Eligible</h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Used or washed items</li>
                <li>• Tags removed</li>
                <li>• After 7 days of delivery</li>
                <li>• Sale items (final sale)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card text-center">
          <p className="text-sm text-gray-600">Need help with a return?</p>
          <Link href="/contact" className="inline-block mt-2 px-6 py-2 bg-secondary text-white text-sm font-medium rounded-lg">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
