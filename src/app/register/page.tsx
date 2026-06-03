'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function RegisterPage() {
  const setUser = useStore((s) => s.setUser);
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);

  const strength = form.password.length >= 8 ? (form.password.match(/[A-Z]/) && form.password.match(/\d/) ? 'Strong' : 'Medium') : form.password.length > 0 ? 'Weak' : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!agree) { setError('Please agree to Terms & Conditions'); return; }

    const users = JSON.parse(localStorage.getItem('pjc_registered_users') || '[]');
    if (users.find((u: any) => u.email === form.email)) { setError('Email already registered'); return; }
    users.push({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    localStorage.setItem('pjc_registered_users', JSON.stringify(users));
    setUser({ name: form.name, email: form.email, phone: form.phone });
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 gradient-gold rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-black text-lg font-bold font-display">PJC</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
          <p className="text-[#666] text-xs mt-1">Join Prasad Jeans Club</p>
        </div>

        <div className="card rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <p className="text-[#E74C3C] text-xs bg-[#E74C3C]/10 border border-[#E74C3C]/20 rounded-md px-3 py-2">{error}</p>}
            <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Full Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input w-full" placeholder="Your name" /></div>
            <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="input w-full" placeholder="your@email.com" /></div>
            <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required className="input w-full" placeholder="10-digit number" /></div>
            <div>
              <label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required className="input w-full" placeholder="Min 6 characters" />
              {strength && <div className="flex items-center gap-2 mt-1"><div className={`h-1 flex-1 rounded-full ${strength === 'Strong' ? 'bg-[#2ECC71]' : strength === 'Medium' ? 'bg-[#F39C12]' : 'bg-[#E74C3C]'}`} /><span className={`text-[9px] font-bold ${strength === 'Strong' ? 'text-[#2ECC71]' : strength === 'Medium' ? 'text-[#F39C12]' : 'text-[#E74C3C]'}`}>{strength}</span></div>}
            </div>
            <div><label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Confirm Password</label><input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required className="input w-full" placeholder="Re-enter password" /></div>
            <label className="flex items-start gap-2 cursor-pointer pt-1"><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="w-3.5 h-3.5 rounded accent-[#C9A84C] mt-0.5" /><span className="text-[10px] text-[#A0A0A0]">I agree to the <Link href="/terms" className="text-[#C9A84C]">Terms</Link> & <Link href="/privacy" className="text-[#C9A84C]">Privacy Policy</Link></span></label>
            <button type="submit" className="btn-gold w-full py-3 mt-1">CREATE ACCOUNT</button>
          </form>
        </div>

        <p className="text-center text-xs text-[#666] mt-5">
          Already have an account? <Link href="/login" className="text-[#C9A84C] font-bold hover:underline">Login →</Link>
        </p>
      </div>
    </div>
  );
}
