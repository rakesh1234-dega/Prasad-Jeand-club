'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-poppins font-bold text-white">Terms & Conditions</h1>
          <p className="text-gray-300 mt-2">Last updated: January 2024</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-card prose prose-sm max-w-none">
          <h2 className="text-xl font-poppins font-bold text-primary">1. Account Terms</h2>
          <p className="text-gray-600">You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.</p>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">2. Orders & Payment</h2>
          <ul className="text-gray-600 space-y-1">
            <li>All prices are in Indian Rupees (INR) and inclusive of GST</li>
            <li>We reserve the right to cancel orders due to stock unavailability</li>
            <li>Payment must be completed to confirm an order</li>
            <li>Prices are subject to change without notice</li>
          </ul>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">3. Shipping</h2>
          <p className="text-gray-600">Delivery timelines are estimates and may vary. We are not responsible for delays caused by courier services or natural disasters.</p>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">4. Returns & Refunds</h2>
          <p className="text-gray-600">Products can be returned within 7 days of delivery. Items must be unused, unwashed, and in original packaging with all tags attached.</p>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">5. Prohibited Activities</h2>
          <ul className="text-gray-600 space-y-1">
            <li>Creating fake accounts or placing fraudulent orders</li>
            <li>Reselling products purchased from our store</li>
            <li>Using automated tools to access our website</li>
            <li>Any activity that disrupts our services</li>
          </ul>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">6. Intellectual Property</h2>
          <p className="text-gray-600">All content on this website including logos, images, and text is the property of Prasad Jeans Club and protected by copyright laws.</p>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">7. Limitation of Liability</h2>
          <p className="text-gray-600">Prasad Jeans Club is not liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
        </div>
      </div>
    </div>
  );
}
