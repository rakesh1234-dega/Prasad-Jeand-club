'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function Navbar() {
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const user = useStore((s) => s.user);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = wishlist.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Men' },
    { href: '/shop?filter=new', label: 'New In' },
    { href: '/shop?filter=sale', label: 'Sale 🔥' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 h-14 bg-[#111] border-b border-[#2A2A2A] flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="font-display text-xl font-bold text-[#C9A84C] hover:opacity-80 transition-opacity">
            PJC
          </Link>

          {/* Center: Nav Links (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-[13px] font-medium text-[#A0A0A0] hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#222] transition-colors">
              <svg className="w-4 h-4 text-[#A0A0A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#222] transition-colors relative">
              <svg className="w-4 h-4 text-[#A0A0A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C9A84C] text-black text-[9px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#222] transition-colors relative">
              <svg className="w-4 h-4 text-[#A0A0A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C9A84C] text-black text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>

            {/* User */}
            <Link href={user ? '/profile' : '/login'} className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#222] transition-colors">
              {user ? (
                <div className="w-6 h-6 gradient-gold rounded-full flex items-center justify-center"><span className="text-black text-[10px] font-bold">{user.name.charAt(0)}</span></div>
              ) : (
                <svg className="w-4 h-4 text-[#A0A0A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileMenu(true)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#222]">
              <svg className="w-5 h-5 text-[#A0A0A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Search Dropdown */}
      {searchOpen && (
        <div className="fixed top-14 left-0 right-0 z-30 bg-[#111] border-b border-[#2A2A2A] p-3 animate-fadeInDown">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." autoFocus className="input w-full pr-10" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A84C]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setMobileMenu(false)} />
          <div className="absolute top-0 left-0 w-72 h-full bg-[#0D0D0D] border-r border-[#2A2A2A] p-6 animate-slideInLeft">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-2xl font-bold text-[#C9A84C]">PJC</span>
              <button onClick={() => setMobileMenu(false)} className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1A1A1A] text-[#A0A0A0]">✕</button>
            </div>
            <nav className="space-y-1">
              {[
                { href: '/', label: 'Home', icon: '🏠' },
                { href: '/shop', label: 'Shop All', icon: '🛍️' },
                { href: '/shop/shirts', label: 'Shirts', icon: '👔' },
                { href: '/shop/tshirts', label: 'T-Shirts', icon: '👕' },
                { href: '/shop/jeans', label: 'Jeans', icon: '👖' },
                { href: '/shop/hoodies', label: 'Hoodies', icon: '🧥' },
                { href: '/shop/jackets', label: 'Jackets', icon: '🥼' },
                { href: '/shop/shorts', label: 'Shorts', icon: '🩳' },
                { href: '/wishlist', label: 'Wishlist', icon: '❤️' },
                { href: '/cart', label: 'Cart', icon: '🛒' },
                { href: '/orders', label: 'Orders', icon: '📦' },
                { href: '/about', label: 'About', icon: '🏢' },
                { href: '/contact', label: 'Contact', icon: '📞' },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors text-sm">
                  <span>{item.icon}</span>{item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
              {user ? (
                <Link href="/profile" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#C9A84C]">
                  <div className="w-7 h-7 gradient-gold rounded-full flex items-center justify-center"><span className="text-black text-[10px] font-bold">{user.name.charAt(0)}</span></div>
                  {user.name}
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenu(false)} className="btn-gold w-full text-center block">LOGIN</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
