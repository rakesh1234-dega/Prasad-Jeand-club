'use client';

import React, { useState } from 'react';

const faqs = [
  { cat: 'Shipping', items: [{ q: 'How long does delivery take?', a: 'Standard: 3-5 days. Express: 1-2 days.' },{ q: 'Is shipping free?', a: 'Free on orders above ₹999. Otherwise ₹99.' }] },
  { cat: 'Returns', items: [{ q: 'What is your return policy?', a: '7-day easy returns. Items must be unused with tags.' },{ q: 'When will I get my refund?', a: 'Refunds are processed within 5-7 business days.' }] },
  { cat: 'Payments', items: [{ q: 'What payment methods are accepted?', a: 'UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.' },{ q: 'Is COD available?', a: 'Yes, with ₹40 additional charge.' }] },
  { cat: 'Orders', items: [{ q: 'How do I track my order?', a: 'Go to My Orders to see real-time tracking.' },{ q: 'Can I cancel my order?', a: 'Yes, before it is shipped. Go to Orders → Cancel.' }] },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="min-h-screen">
      <div className="bg-[#111] border-b border-[#2A2A2A] py-12 text-center">
        <h1 className="font-display text-3xl font-bold text-white">FAQ</h1>
        <p className="text-[#666] text-sm mt-1">Frequently Asked Questions</p>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {faqs.map(s => (
          <div key={s.cat}>
            <h2 className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-3">{s.cat}</h2>
            <div className="space-y-1.5">{s.items.map((item, i) => {
              const id = `${s.cat}-${i}`;
              return (
                <div key={id} className="card rounded-lg overflow-hidden">
                  <button onClick={() => setOpen(open === id ? null : id)} className="w-full flex items-center justify-between px-4 py-3 text-left">
                    <span className="text-xs font-medium text-white">{item.q}</span>
                    <span className="text-[#666] text-xs">{open === id ? '−' : '+'}</span>
                  </button>
                  {open === id && <div className="px-4 pb-3"><p className="text-xs text-[#A0A0A0] leading-relaxed">{item.a}</p></div>}
                </div>
              );
            })}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
