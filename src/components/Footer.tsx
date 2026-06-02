'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">PJC</span>
              </div>
              <div>
                <h3 className="font-poppins font-bold text-base">PRASAD JEANS</h3>
                <p className="text-[9px] text-gray-400 tracking-widest uppercase">Club • Est 2020</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Premium men&apos;s fashion at prices you&apos;ll love. Quality clothing delivered across India.
            </p>
            <div className="flex gap-2 mt-4">
              {['FB', 'IG', 'TW', 'YT'].map(s => (
                <a key={s} href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-300 hover:bg-red-600 hover:text-white transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Shop</h4>
            <ul className="space-y-2">
              {[
                { href: '/shop/jeans', label: 'Jeans' },
                { href: '/shop/shirts', label: 'Shirts' },
                { href: '/shop/tshirts', label: 'T-Shirts' },
                { href: '/shop/hoodies', label: 'Hoodies' },
                { href: '/shop/jackets', label: 'Jackets' },
                { href: '/shop/shorts', label: 'Shorts' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2">
              {[
                { href: '/faq', label: 'FAQ' },
                { href: '/returns', label: 'Returns' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/orders', label: 'Track Order' },
                { href: '/privacy', label: 'Privacy' },
                { href: '/terms', label: 'Terms' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Contact</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>📱 +91 98765 43210</li>
              <li>📧 support@prasadjeans.com</li>
              <li>📍 Mumbai, India</li>
              <li>⏰ Mon-Sat: 10AM-8PM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-gray-500">© 2024 Prasad Jeans Club. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span>Payments:</span>
            {['VISA', 'MC', 'UPI', 'GPay', 'COD'].map(m => (
              <span key={m} className="bg-white/10 px-2 py-0.5 rounded">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
