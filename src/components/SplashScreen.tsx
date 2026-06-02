'use client';

import React, { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 500);
    const timer2 = setTimeout(() => setShowTagline(true), 1200);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-primary-light to-primary-dark flex flex-col items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 border border-white rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 border border-white rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Logo Animation */}
      <div className={`transition-all duration-1000 ${showText ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        {/* Logo Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
            <span className="text-white text-4xl font-poppins font-bold">PJC</span>
          </div>
        </div>
        
        {/* Brand Name */}
        <h1 className="text-4xl md:text-6xl font-poppins font-bold text-white text-center tracking-tight">
          <span className="text-secondary">PRASAD</span>
          <br />
          <span className="text-white">JEANS CLUB</span>
        </h1>
      </div>

      {/* Tagline */}
      <p className={`mt-6 text-lg md:text-xl text-gray-300 font-inter tracking-wider transition-all duration-700 ${showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Style That Defines You
      </p>

      {/* Progress Bar */}
      <div className="mt-12 w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Loading dots */}
      <div className="mt-4 flex space-x-2">
        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}
