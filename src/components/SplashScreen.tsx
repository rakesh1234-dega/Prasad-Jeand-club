'use client';

import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 4;
      });
    }, 100);
    const timer = setTimeout(onComplete, 3000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0D0D0D] flex flex-col items-center justify-center">
      <div className={`transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <h1 className="font-display text-6xl md:text-7xl font-bold text-center">
          <span className="gradient-gold bg-clip-text text-transparent">PJC</span>
        </h1>
        <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase text-center mt-3 font-body">
          Premium Men&apos;s Fashion
        </p>
      </div>
      <div className="mt-10 w-48 h-[3px] bg-[#2A2A2A] rounded-full overflow-hidden">
        <div className="h-full gradient-gold rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
