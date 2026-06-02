'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 gradient-gold rounded-lg flex items-center justify-center"><span className="text-black text-xs font-bold">PJC</span></div>
              <div><h3 className="font-display text-base font-bold text-white">PRASAD JEANS</h3><p className="text-[9px] text-[#666] tracking-widest uppercase">Club • Est 2020</p></div>
            </div>
            <p className="text-xs text-[#666] leading-relaxed">Premium men&apos;s fashion. Quality you can feel. Prices you&apos;ll love.</p>
          </div>
          {/* Shop */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#C9A84C] mb-4">SHOP</h4>
            <ul className="space-y-2.5">{[{h:'/shop/jeans',l:'Jeans'},{h:'/shop/shirts',l:'Shirts'},{h:'/shop/tshirts',l:'T-Shirts'},{h:'/shop/hoodies',l:'Hoodies'},{h:'/shop/jackets',l:'Jackets'},{h:'/shop/shorts',l:'Shorts'}].map(i=><li key={i.h}><Link href={i.h} className="text-xs text-[#A0A0A0] hover:text-[#C9A84C] transition-colors">{i.l}</Link></li>)}</ul>
          </div>
          {/* Help */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#C9A84C] mb-4">HELP</h4>
            <ul className="space-y-2.5">{[{h:'/faq',l:'FAQ'},{h:'/returns',l:'Returns'},{h:'/contact',l:'Contact'},{h:'/orders',l:'Track Order'},{h:'/privacy',l:'Privacy'},{h:'/terms',l:'Terms'}].map(i=><li key={i.h}><Link href={i.h} className="text-xs text-[#A0A0A0] hover:text-[#C9A84C] transition-colors">{i.l}</Link></li>)}</ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#C9A84C] mb-4">CONTACT</h4>
            <ul className="space-y-2.5 text-xs text-[#A0A0A0]">
              <li>📱 +91 98765 43210</li><li>📧 support@prasadjeans.com</li><li>📍 Mumbai, India</li><li>⏰ Mon-Sat: 10AM-8PM</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-[#666]">© 2024 Prasad Jeans Club. All rights reserved.</p>
          <div className="flex gap-2 text-[10px] text-[#666]">{['VISA','MC','UPI','GPay','COD'].map(m=><span key={m} className="px-2 py-0.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded">{m}</span>)}</div>
        </div>
      </div>
    </footer>
  );
}
