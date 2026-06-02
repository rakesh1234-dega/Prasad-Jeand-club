'use client';

import React, { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowLogo(true), 300);
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 100 : prev + 5);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0D0D0D] flex flex-col items-center justify-center">
      {/* Logo */}
      <div className={`transition-all duration-700 ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <div className="w-20 h-20 gradient-gold rounded-2xl flex items-center justify-center shadow-gold-lg mb-6 mx-auto">
          <span className="text-black text-2xl font-bold font-display">PJC</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white text-center">
          PRASAD<br/><span className="text-[#C9A84C]">JEANS CLUB</span>
        </h1>
        <p className="text-[#666] text-xs tracking-[0.3em] uppercase mt-3 text-center">Premium Men&apos;s Fashion</p>
      </div>

      {/* Progress */}
      <div className="mt-10 w-48 h-0.5 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div className="h-full gradient-gold rounded-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
