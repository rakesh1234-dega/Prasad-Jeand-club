'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  itemCount: number;
  applyCoupon: (code: string) => boolean;
  appliedCoupon: string | null;
  couponDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('pjc_cart');
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('pjc_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.size === size && item.color === color
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, size, color }];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems(prev => prev.map(item =>
      item.product.id === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const getSubtotal = () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const getDiscount = () => items.reduce((sum, item) => sum + (item.product.oldPrice - item.product.price) * item.quantity, 0);

  const getTotal = () => {
    const subtotal = getSubtotal();
    const couponAmount = (subtotal * couponDiscount) / 100;
    return subtotal - couponAmount;
  };

  const applyCoupon = (code: string): boolean => {
    const coupons: Record<string, number> = {
      'PRASAD10': 10,
      'PRASAD20': 20,
      'FIRST50': 50,
      'SUMMER15': 15,
    };
    
    const discount = coupons[code.toUpperCase()];
    if (discount) {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(discount);
      return true;
    }
    return false;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      getTotal, getSubtotal, getDiscount, itemCount, applyCoupon, appliedCoupon, couponDiscount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
