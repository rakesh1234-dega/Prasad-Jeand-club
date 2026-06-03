'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from './SplashScreen';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';
import EmailPopup from './EmailPopup';
import SocialProofToast from './SocialProofToast';
import ExitIntentPopup from './ExitIntentPopup';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem('pjc_splash_done')) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem('pjc_splash_done', 'true');
  }, []);

  // Abandoned cart tracking
  useEffect(() => {
    const handleBeforeUnload = () => {
      const store = localStorage.getItem('pjc-store');
      if (store) {
        const parsed = JSON.parse(store);
        if (parsed?.state?.cart?.length > 0) {
          localStorage.setItem('pjc_cart_abandoned', 'true');
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAuthPage && !isAdminPage && <AnnouncementBar />}
      {!isAuthPage && !isAdminPage && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAuthPage && !isAdminPage && <Footer />}
      <Toast />
      {!isAuthPage && !isAdminPage && <EmailPopup />}
      {!isAuthPage && !isAdminPage && <SocialProofToast />}
      {!isAuthPage && !isAdminPage && <ExitIntentPopup />}
    </>
  );
}
