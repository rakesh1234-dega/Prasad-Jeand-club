'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">PJC</span>
              </div>
              <div>
                <h3 className="font-poppins font-bold text-lg">PRASAD JEANS</h3>
                <p className="text-[10px] text-gray-400 tracking-wider">CLUB</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your destination for premium men&apos;s fashion. Quality clothing at affordable prices since 2020.
            </p>
            <div className="flex gap-3 mt-4">
              {['facebook', 'instagram', 'twitter', 'youtube'].map(social => (
                <a key={social} href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                  <span className="text-xs capitalize">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/shop', label: 'Shop All' },
                { href: '/shop/jeans', label: 'Jeans' },
                { href: '/shop/shirts', label: 'Shirts' },
                { href: '/shop/tshirts', label: 'T-Shirts' },
                { href: '/shop/hoodies', label: 'Hoodies' },
                { href: '/shop/jackets', label: 'Jackets' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              {[
                { href: '/faq', label: 'FAQ' },
                { href: '/returns', label: 'Return Policy' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/about', label: 'About Us' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-secondary">📍</span>
                <span className="text-sm text-gray-400">123, Fashion Street, Textile Market, Mumbai - 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary">📱</span>
                <span className="text-sm text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary">📧</span>
                <span className="text-sm text-gray-400">support@prasadjeans.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary">⏰</span>
                <span className="text-sm text-gray-400">Mon-Sat: 10AM - 8PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © 2024 Prasad Jeans Club. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">Secure Payments:</span>
            <div className="flex gap-2">
              {['VISA', 'MC', 'UPI', 'COD'].map(method => (
                <span key={method} className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
