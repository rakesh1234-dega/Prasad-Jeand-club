'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-poppins font-bold text-white">Privacy Policy</h1>
          <p className="text-gray-300 mt-2">Last updated: January 2024</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-card prose prose-sm max-w-none">
          <h2 className="text-xl font-poppins font-bold text-primary">1. Information We Collect</h2>
          <p className="text-gray-600">We collect information you provide directly to us, including name, email address, phone number, shipping address, and payment information when you make a purchase.</p>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">2. How We Use Your Information</h2>
          <ul className="text-gray-600 space-y-1">
            <li>Process your orders and payments</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your questions and requests</li>
            <li>Send promotional offers (with your consent)</li>
            <li>Improve our products and services</li>
          </ul>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">3. Information Sharing</h2>
          <p className="text-gray-600">We do not sell your personal information. We may share information with shipping partners to deliver your orders and payment processors to handle transactions.</p>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">4. Data Security</h2>
          <p className="text-gray-600">We implement industry-standard security measures to protect your personal information, including SSL encryption for all data transfers.</p>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">5. Cookies</h2>
          <p className="text-gray-600">We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic.</p>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">6. Your Rights</h2>
          <p className="text-gray-600">You have the right to access, correct, or delete your personal information. Contact us at support@prasadjeans.com for any requests.</p>

          <h2 className="text-xl font-poppins font-bold text-primary mt-8">7. Contact Us</h2>
          <p className="text-gray-600">If you have questions about this Privacy Policy, contact us at:<br />Email: support@prasadjeans.com<br />Phone: +91 98765 43210</p>
        </div>
      </div>
    </div>
  );
}
