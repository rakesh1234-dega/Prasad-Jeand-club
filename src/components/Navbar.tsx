'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useNotifications } from '@/context/NotificationContext';
import { categories } from '@/data/products';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const categoryRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategories(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <span className="text-white text-sm font-bold">PJC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-poppins font-bold text-primary leading-tight">
                  PRASAD <span className="text-secondary">JEANS</span>
                </h1>
                <p className="text-[10px] text-gray-500 -mt-1 tracking-wider">CLUB</p>
              </div>
            </Link>

            {/* Center - Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-secondary transition-colors relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all"></span>
              </Link>
              <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-secondary transition-colors relative group">
                Shop
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all"></span>
              </Link>
              
              {/* Categories Dropdown */}
              <div 
                ref={categoryRef}
                className="relative"
              >
                <button onClick={() => setShowCategories(!showCategories)} className="text-sm font-medium text-gray-700 hover:text-secondary transition-colors flex items-center gap-1">
                  Categories
                  <svg className={`w-4 h-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Animated Horizontal Dropdown */}
                {showCategories && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 animate-slide-down">
                    <div className="flex gap-4">
                      {categories.map((cat, index) => (
                        <Link
                          key={cat.id}
                          href={`/shop/${cat.id}`}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 min-w-[100px] opacity-0 animate-stagger"
                          style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                            {cat.icon}
                          </div>
                          <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                          <span className="text-[10px] text-secondary font-medium">Shop Now →</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-secondary transition-colors relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all"></span>
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-secondary transition-colors relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all"></span>
              </Link>
            </div>

            {/* Right - Action Icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce-in">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Panel */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-down">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-poppins font-semibold text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-secondary hover:text-secondary-dark">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                      ) : (
                        notifications.slice(0, 10).map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                              !notif.isRead ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                !notif.isRead ? 'bg-secondary' : 'bg-gray-300'
                              }`}></div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative hidden sm:block">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              {isAuthenticated ? (
                <div className="relative group">
                  <Link href="/profile" className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:block">
                    <div className="w-7 h-7 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                  </Link>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors">
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        {showSearch && (
          <div className="border-t border-gray-100 py-3 px-4 animate-slide-down">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for jeans, shirts, t-shirts..."
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-sm"
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-[99] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)}></div>
          <div className="absolute top-0 left-0 w-72 h-full bg-white shadow-2xl animate-fade-in overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">PJC</span>
                </div>
                <div>
                  <h2 className="font-poppins font-bold text-primary">PRASAD JEANS</h2>
                  <p className="text-[10px] text-gray-500">CLUB</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { href: '/', label: 'Home', icon: '🏠' },
                  { href: '/shop', label: 'Shop All', icon: '🛍️' },
                  { href: '/shop/tshirts', label: 'T-Shirts', icon: '👕' },
                  { href: '/shop/shirts', label: 'Shirts', icon: '👔' },
                  { href: '/shop/jeans', label: 'Jeans', icon: '👖' },
                  { href: '/shop/hoodies', label: 'Hoodies', icon: '🧥' },
                  { href: '/shop/jackets', label: 'Jackets', icon: '🧥' },
                  { href: '/shop/shorts', label: 'Shorts', icon: '🩳' },
                  { href: '/wishlist', label: 'Wishlist', icon: '❤️' },
                  { href: '/orders', label: 'My Orders', icon: '📋' },
                  { href: '/about', label: 'About Us', icon: '🏢' },
                  { href: '/contact', label: 'Contact', icon: '📞' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link href="/profile" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user?.name?.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium">{user?.name}</span>
                    </Link>
                    <button onClick={() => { logout(); setShowMobileMenu(false); }} className="w-full px-4 py-3 text-sm text-red-500 font-medium text-left rounded-lg hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" onClick={() => setShowMobileMenu(false)} className="block w-full px-4 py-3 bg-primary text-white text-center text-sm font-medium rounded-lg">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setShowMobileMenu(false)} className="block w-full px-4 py-3 border border-primary text-primary text-center text-sm font-medium rounded-lg">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
