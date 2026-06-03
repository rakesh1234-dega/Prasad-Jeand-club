'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const setUser = useStore((s) => s.setUser);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Demo login or check localStorage users
      if ((email === 'test@pjc.com' && password === 'password123') || (email === 'demo@prasadjeans.com' && password === 'demo123')) {
        setUser({ name: 'Prasad User', email, phone: '9876543210' });
        router.push('/');
        return;
      }
      const users = JSON.parse(localStorage.getItem('pjc_registered_users') || '[]');
      const found = users.find((u: any) => u.email === email && u.password === password);
      if (found) {
        setUser({ name: found.name, email: found.email, phone: found.phone });
        router.push('/');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 gradient-gold rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-black text-lg font-bold font-display">PJC</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-[#666] text-xs mt-1">Login to Prasad Jeans Club</p>
        </div>

        <div className="card rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-[#E74C3C] text-xs bg-[#E74C3C]/10 border border-[#E74C3C]/20 rounded-md px-3 py-2">{error}</p>}

            <div>
              <label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input w-full" placeholder="your@email.com" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider block mb-1">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="input w-full pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] text-xs">{showPass ? '🙈' : '👁'}</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#C9A84C]" /><span className="text-[10px] text-[#A0A0A0]">Remember me</span></label>
              <button type="button" className="text-[10px] text-[#C9A84C] hover:underline">Forgot Password?</button>
            </div>

            <button type="submit" disabled={loading} className={`w-full py-3 rounded font-bold text-sm uppercase tracking-wider ${loading ? 'bg-[#333] text-[#666]' : 'gradient-gold text-black hover:opacity-90'} transition-all`}>
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-4 p-2.5 bg-[#222] rounded-md text-center">
            <p className="text-[9px] text-[#666]">Demo: <strong className="text-[#A0A0A0]">test@pjc.com</strong> / <strong className="text-[#A0A0A0]">password123</strong></p>
          </div>
        </div>

        <p className="text-center text-xs text-[#666] mt-5">
          New here? <Link href="/register" className="text-[#C9A84C] font-bold hover:underline">Create Account →</Link>
        </p>
      </div>
    </div>
  );
}
