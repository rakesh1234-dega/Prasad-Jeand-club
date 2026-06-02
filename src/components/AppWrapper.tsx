'use client';

import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
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

  if (showSplash) {
    return <SplashScreen />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className={`flex-1 ${!isAuthPage ? 'pt-16' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
      <Toast />
    </div>
  );
}
