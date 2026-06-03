export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  category: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  stock: number;
  emoji: string;
  description: string;
  createdAt: string;
  soldCount?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  emoji: string;
}

export interface Coupon {
  code: string;
  discount: number;
  minOrder: number;
  expiry: string;
  active: boolean;
}

export interface FlashOffer {
  id: string;
  title: string;
  discount: number;
  endsAt: string;
  productIds: string[];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  address: Address;
  payment: string;
  createdAt: string;
}

export interface Address {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
}
