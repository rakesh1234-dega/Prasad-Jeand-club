'use client';

import React, { useState, useEffect } from 'react';

interface ToastMsg { id: string; text: string; }

let globalShow: (text: string) => void = () => {};

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const show = (text: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  useEffect(() => {
    globalShow = show;
    (window as any).__pjcToast = show;
  }, []);

  return (
    <div className="fixed top-16 right-4 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="toast-enter bg-[#1A1A1A] border border-[#C9A84C]/30 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-gold flex items-center gap-2 pointer-events-auto">
          <span className="text-[#C9A84C]">✓</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
