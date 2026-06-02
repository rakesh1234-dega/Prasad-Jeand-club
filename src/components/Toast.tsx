'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let globalShowToast: (message: string, type?: 'success' | 'error' | 'info') => void = () => {};

export function getToast() {
  return globalShowToast;
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    globalShowToast = showToast;
    (window as any).__pjcToast = showToast;
  }, []);

  return (
    <div className="fixed top-20 right-4 z-[9998] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 min-w-[250px] ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          <span>
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
