'use client';

import React, { useState, useEffect } from 'react';

export default function EmailPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const subscribed = localStorage.getItem('pjc_subscribed');
    const seen = sessionStorage.getItem('pjc_popup_seen');
    if (!subscribed && !seen) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('pjc_subscribed', email);
      sessionStorage.setItem('pjc_popup_seen', 'true');
      setSubmitted(true);
      setTimeout(() => setShow(false), 3000);
    }
  };

  const dismiss = () => {
    sessionStorage.setItem('pjc_popup_seen', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4" onClick={dismiss}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative card border-[#C9A84C]/30 max-w-sm w-full animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        {/* Gold top bar */}
        <div className="h-1 gradient-gold" />

        <div className="p-7 text-center">
          {!submitted ? (
            <>
              <span className="inline-block px-3 py-1 bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] rounded-full text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-4">
                💎 Exclusive Offer
              </span>
              <h2 className="font-display text-2xl font-bold text-white leading-tight">
                Get 15% Off<br/>Your First Order
              </h2>
              <p className="text-[#A0A0A0] text-xs mt-2 leading-relaxed">
                Plus: weekly style tips, early access to sales, and exclusive member pricing
              </p>
              <form onSubmit={handleSubmit} className="mt-5">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="input w-full text-center" />
                <button type="submit" className="btn-gold w-full mt-3">Claim My 15% Off</button>
              </form>
              <p className="text-[9px] text-[#666] mt-3">🔒 No spam. Unsubscribe anytime.</p>
              <button onClick={dismiss} className="text-[11px] text-[#666] mt-3 hover:text-[#A0A0A0] transition-colors block mx-auto">
                No thanks, I prefer full price
              </button>
            </>
          ) : (
            <div className="py-4">
              <span className="text-4xl block mb-3">🎉</span>
              <h3 className="font-display text-xl font-bold text-white">Check Your Inbox!</h3>
              <p className="text-[#A0A0A0] text-xs mt-2">Your exclusive code:</p>
              <span className="inline-block mt-2 px-4 py-2 bg-[rgba(201,168,76,0.15)] border border-[#C9A84C]/30 rounded-lg text-[#C9A84C] font-bold text-lg tracking-wider">WELCOME15</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
