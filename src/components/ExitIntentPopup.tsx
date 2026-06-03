'use client';

import React, { useState, useEffect } from 'react';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('pjc_exit_seen');
    if (seen) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
        sessionStorage.setItem('pjc_exit_seen', 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    // Only add after 10 seconds on page
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShow(false)} />
      <div className="relative card border-[#C9A84C]/30 max-w-sm w-full animate-scaleIn text-center">
        <div className="h-1 gradient-gold" />
        <div className="p-7">
          <span className="text-4xl block mb-3">😮</span>
          <h2 className="font-display text-xl font-bold text-white">Wait! Don&apos;t Leave<br/>Empty-Handed</h2>
          <p className="text-[#A0A0A0] text-sm mt-3">
            Here&apos;s an extra <span className="text-[#C9A84C] font-bold">10% OFF</span> just for you
          </p>
          <div className="mt-4 p-3 bg-[rgba(201,168,76,0.1)] border border-[#C9A84C]/30 rounded-lg">
            <p className="text-[10px] text-[#A0A0A0] uppercase tracking-wider">Your exclusive code</p>
            <p className="text-2xl font-bold text-[#C9A84C] tracking-wider mt-1">STAYPJC</p>
          </div>
          <button onClick={() => { setShow(false); window.location.href = '/shop'; }} className="btn-gold w-full mt-4">
            CLAIM MY DISCOUNT
          </button>
          <button onClick={() => setShow(false)} className="text-[11px] text-[#666] mt-3 hover:text-[#A0A0A0] block mx-auto">
            No thanks, I&apos;ll leave
          </button>
        </div>
      </div>
    </div>
  );
}
