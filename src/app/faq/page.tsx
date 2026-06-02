'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const faqData = [
  {
    category: 'Shipping',
    questions: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 5-7 business days. Express delivery takes 2-3 business days.' },
      { q: 'Is shipping free?', a: 'Yes! Free shipping on all orders above ₹999. Orders below ₹999 have a ₹99 delivery charge.' },
      { q: 'Do you deliver across India?', a: 'Yes, we deliver to all pin codes across India through our trusted courier partners.' },
    ],
  },
  {
    category: 'Returns',
    questions: [
      { q: 'What is your return policy?', a: 'We offer 7-day easy returns on all products. Items must be unused with original tags attached.' },
      { q: 'How do I initiate a return?', a: 'Go to My Orders, select the order, and click "Return". Our team will arrange pickup within 48 hours.' },
      { q: 'When will I get my refund?', a: 'Refunds are processed within 5-7 business days after we receive the returned item.' },
    ],
  },
  {
    category: 'Payments',
    questions: [
      { q: 'What payment methods do you accept?', a: 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.' },
      { q: 'Is my payment information secure?', a: 'Absolutely! We use industry-standard encryption and never store your payment details.' },
      { q: 'Can I pay Cash on Delivery?', a: 'Yes, COD is available on orders up to ₹5000. An additional ₹40 COD charge applies.' },
    ],
  },
  {
    category: 'Orders',
    questions: [
      { q: 'How can I track my order?', a: 'Go to My Orders section to track your order status in real-time.' },
      { q: 'Can I cancel my order?', a: 'Yes, orders can be cancelled before they are shipped. Go to My Orders and click Cancel.' },
      { q: 'Can I modify my order after placing it?', a: 'Unfortunately, orders cannot be modified once placed. You can cancel and place a new order.' },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-poppins font-bold text-white">FAQ</h1>
          <p className="text-gray-300 mt-2">Frequently Asked Questions</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {faqData.map(section => (
          <div key={section.category}>
            <h2 className="text-xl font-poppins font-bold text-primary mb-4">{section.category}</h2>
            <div className="space-y-2">
              {section.questions.map((item, i) => {
                const id = `${section.category}-${i}`;
                const isOpen = openItems.includes(id);
                return (
                  <div key={id} className="bg-white rounded-xl overflow-hidden shadow-card">
                    <button
                      onClick={() => toggleItem(id)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="text-sm font-medium text-gray-800 pr-4">{item.q}</span>
                      <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 animate-slide-down">
                        <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl p-8 text-center shadow-card">
          <h3 className="font-semibold text-lg">Still have questions?</h3>
          <p className="text-sm text-gray-500 mt-1">Our support team is here to help</p>
          <Link href="/contact" className="inline-block mt-4 px-6 py-2 bg-secondary text-white text-sm font-medium rounded-lg">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
