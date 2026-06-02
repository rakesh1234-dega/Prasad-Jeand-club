'use client';

import React, { useState, useEffect } from 'react';

export default function EmailPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('pjc_popup_shown');
    if (!shown) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      sessionStorage.setItem('pjc_popup_shown', 'true');
      setTimeout(() => setShow(false), 3000);
    }
  };

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('pjc_popup_shown', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={dismiss}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div
        className="relative bg-[#1A1A1A] rounded-2xl max-w-md w-full overflow-hidden border border-[#2A2A2A] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold top border */}
        <div className="h-1 gradient-gold"></div>

        <div className="p-8 text-center">
          {!submitted ? (
            <>
              {/* Badge */}
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] rounded-full text-xs font-bold text-[#C9A84C] uppercase tracking-wider mb-4">
                💎 EXCLUSIVE OFFER
              </span>

              {/* Heading */}
              <h2 className="font-display text-3xl font-bold text-white leading-tight">
                Get 15% Off<br />Your First Order
              </h2>

              {/* Subtext */}
              <p className="text-[#A0A0A0] text-sm mt-3 leading-relaxed">
                Plus: weekly style tips, early access to sales, and exclusive member pricing
              </p>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="mt-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-5 py-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white placeholder-[#666] text-base focus:outline-none focus:border-[#C9A84C] focus:shadow-gold transition-all"
                />
                <button
                  type="submit"
                  className="w-full mt-3 py-4 gradient-gold text-black font-bold text-sm rounded-xl hover:opacity-90 transition-all uppercase tracking-wider"
                >
                  Claim My 15% Off
                </button>
              </form>

              {/* Trust */}
              <p className="text-[10px] text-[#666] mt-3">🔒 No spam. Unsubscribe anytime.</p>

              {/* Dismiss */}
              <button onClick={dismiss} className="text-xs text-[#666] mt-4 hover:text-[#A0A0A0] transition-colors">
                No thanks, I prefer full price
              </button>
            </>
          ) : (
            <div className="py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-display text-2xl font-bold text-white">Check Your Inbox!</h3>
              <p className="text-[#A0A0A0] text-sm mt-2">Your 15% off code is on its way</p>
              <p className="text-xs text-[#C9A84C] font-bold mt-3">Code: FIRST15</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
