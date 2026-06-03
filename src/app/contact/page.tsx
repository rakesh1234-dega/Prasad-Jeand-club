'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); const msgs = JSON.parse(localStorage.getItem('pjc_messages') || '[]'); msgs.push({ ...form, date: new Date().toISOString() }); localStorage.setItem('pjc_messages', JSON.stringify(msgs)); };

  return (
    <div className="min-h-screen">
      <div className="bg-[#111] border-b border-[#2A2A2A] py-12 text-center">
        <h1 className="font-display text-3xl font-bold text-white">Contact Us</h1>
        <p className="text-[#666] text-sm mt-1">We&apos;d love to hear from you</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {[{i:'📱',t:'Phone',v:'+91 98765 43210'},{i:'📧',t:'Email',v:'support@prasadjeans.com'},{i:'📍',t:'Address',v:'Mumbai, India'},{i:'⏰',t:'Hours',v:'Mon-Sat 10AM-8PM'}].map(c=>(
            <div key={c.t} className="card rounded-lg p-4"><span className="text-xl">{c.i}</span><p className="text-[10px] text-[#666] uppercase tracking-wider mt-1">{c.t}</p><p className="text-xs text-white mt-0.5">{c.v}</p></div>
          ))}
        </div>
        <div className="md:col-span-2 card rounded-xl p-6">
          {sent ? (
            <div className="text-center py-8"><span className="text-4xl block mb-3">✉️</span><h3 className="font-display text-lg font-bold text-white">Message Sent!</h3><p className="text-xs text-[#A0A0A0] mt-1">We&apos;ll reply within 24 hours</p></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="input" placeholder="Name" /><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="input" placeholder="Email" /></div>
              <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required className="input w-full" placeholder="Subject" />
              <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required className="input w-full" rows={4} placeholder="Your message" />
              <button type="submit" className="btn-gold w-full">SEND MESSAGE</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
