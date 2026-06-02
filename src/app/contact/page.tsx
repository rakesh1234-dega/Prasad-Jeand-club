'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if ((window as any).__pjcToast) (window as any).__pjcToast('Message sent successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-poppins font-bold text-white">Contact Us</h1>
          <p className="text-gray-300 mt-2">We&apos;d love to hear from you</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: '📍', title: 'Address', info: '123, Fashion Street, Textile Market, Mumbai - 400001' },
              { icon: '📱', title: 'Phone', info: '+91 98765 43210' },
              { icon: '📧', title: 'Email', info: 'support@prasadjeans.com' },
              { icon: '⏰', title: 'Business Hours', info: 'Mon - Sat: 10:00 AM - 8:00 PM' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl p-5 shadow-card">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{item.info}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-card">
              {submitted ? (
                <div className="text-center py-12">
                  <span className="text-5xl">✉️</span>
                  <h3 className="text-xl font-semibold mt-4">Message Sent!</h3>
                  <p className="text-gray-500 mt-2">We&apos;ll get back to you within 24 hours</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-4 px-6 py-2 bg-secondary text-white text-sm rounded-lg">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-poppins font-semibold mb-2">Send us a message</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                      <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
                    <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Message</label>
                    <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={5} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary resize-none" placeholder="Tell us more..." />
                  </div>
                  <button type="submit" className="w-full py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark transition-colors">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
