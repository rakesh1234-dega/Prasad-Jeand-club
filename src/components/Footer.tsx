'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl font-bold text-[#C9A84C]">PJC</h3>
            <p className="text-[10px] text-[#666] tracking-[0.2em] uppercase mt-0.5">Premium Men&apos;s Fashion</p>
            <p className="text-xs text-[#A0A0A0] mt-3 leading-relaxed">Quality clothing at prices you&apos;ll love. Serving 50,000+ happy customers across India.</p>
          </div>
          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider mb-3">Shop</h4>
            <ul className="space-y-2">{[{h:'/shop/shirts',l:'Shirts'},{h:'/shop/tshirts',l:'T-Shirts'},{h:'/shop/jeans',l:'Jeans'},{h:'/shop/hoodies',l:'Hoodies'},{h:'/shop/jackets',l:'Jackets'},{h:'/shop/shorts',l:'Shorts'}].map(i=><li key={i.h}><Link href={i.h} className="text-xs text-[#A0A0A0] hover:text-[#C9A84C] transition-colors">{i.l}</Link></li>)}</ul>
          </div>
          {/* Help */}
          <div>
            <h4 className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider mb-3">Help</h4>
            <ul className="space-y-2">{[{h:'/faq',l:'FAQ'},{h:'/returns',l:'Returns'},{h:'/contact',l:'Contact'},{h:'/orders',l:'Track Order'},{h:'/privacy',l:'Privacy'},{h:'/terms',l:'Terms'}].map(i=><li key={i.h}><Link href={i.h} className="text-xs text-[#A0A0A0] hover:text-[#C9A84C] transition-colors">{i.l}</Link></li>)}</ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider mb-3">Contact</h4>
            <ul className="space-y-2 text-xs text-[#A0A0A0]">
              <li>📱 +91 98765 43210</li>
              <li>📧 support@pjcfashion.com</li>
              <li>📍 Mumbai, India</li>
              <li>⏰ Mon-Sat 10AM-8PM</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1A1A1A] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-[#666]">© 2024 PJC Fashion. All rights reserved.</p>
          <div className="flex gap-2">{['VISA','MC','UPI','GPay','COD'].map(m=><span key={m} className="text-[9px] text-[#666] bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-0.5 rounded">{m}</span>)}</div>
        </div>
      </div>
    </footer>
  );
}
