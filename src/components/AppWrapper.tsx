'use client';

import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';
import EmailPopup from './EmailPopup';
import SocialProofToast from './SocialProofToast';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const { isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('pjc_splash_seen');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('pjc_splash_seen', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (showSplash) return <SplashScreen />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#C9A84C] border-t-transparent"></div>
      </div>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
      {!isAuthPage && !isAdminPage && <Navbar />}
      <main className={`flex-1 ${!isAuthPage && !isAdminPage ? 'pt-14' : ''}`}>
        {children}
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
      <Toast />
      {!isAuthPage && !isAdminPage && <EmailPopup />}
      {!isAuthPage && !isAdminPage && <SocialProofToast />}
    </div>
  );
}
