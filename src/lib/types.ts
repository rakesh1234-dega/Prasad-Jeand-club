export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  discount: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  deliveryDate: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'priceDropped' | 'newArrival' | 'coupon' | 'welcome' | 'cartReminder' | 'update';
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  expiryDate: string;
  isActive: boolean;
}

export interface FlashDeal {
  product: Product;
  endTime: string;
  dealPrice: number;
}
