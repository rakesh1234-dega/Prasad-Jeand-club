import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Coupon, FlashOffer, Order, User } from '@/types';

// Default products
const defaultProducts: Product[] = [
  { id: 'p1', name: 'Classic Slim Fit Jeans', price: 1499, mrp: 2999, category: 'jeans', sizes: ['28','30','32','34','36'], colors: ['#1a3a5c','#2c2c2c'], tags: ['trending','bestseller'], stock: 8, emoji: '👖', description: 'Premium slim fit jeans with stretch denim.', createdAt: '2024-01-01', soldCount: 234 },
  { id: 'p2', name: 'Ripped Distressed Denim', price: 1799, mrp: 3499, category: 'jeans', sizes: ['28','30','32','34'], colors: ['#5b8fbe','#2c2c2c'], tags: ['trending','new'], stock: 5, emoji: '👖', description: 'Trendy ripped jeans with distressed look.', createdAt: '2024-02-01', soldCount: 156 },
  { id: 'p3', name: 'Straight Fit Dark Wash', price: 1299, mrp: 2499, category: 'jeans', sizes: ['30','32','34','36','38'], colors: ['#1a1a3e'], tags: ['bestseller'], stock: 12, emoji: '👖', description: 'Classic straight fit dark wash jeans.', createdAt: '2024-01-15', soldCount: 312 },
  { id: 'p4', name: 'Premium Cotton Round Neck', price: 499, mrp: 999, category: 'tshirts', sizes: ['S','M','L','XL','XXL'], colors: ['#fff','#000','#1a3a5c'], tags: ['trending','bestseller','new'], stock: 50, emoji: '👕', description: 'Super soft 100% combed cotton t-shirt.', createdAt: '2024-03-01', soldCount: 456 },
  { id: 'p5', name: 'Graphic Oversized Tee', price: 699, mrp: 1299, category: 'tshirts', sizes: ['M','L','XL','XXL'], colors: ['#000','#fff'], tags: ['trending','new'], stock: 30, emoji: '👕', description: 'Oversized t-shirt with graphic print.', createdAt: '2024-03-10', soldCount: 278 },
  { id: 'p6', name: 'Polo Neck Classic', price: 799, mrp: 1499, category: 'tshirts', sizes: ['S','M','L','XL'], colors: ['#1a1a2e','#8b0000'], tags: ['bestseller'], stock: 20, emoji: '👕', description: 'Classic polo with embroidered logo.', createdAt: '2024-02-20', soldCount: 345 },
  { id: 'p7', name: 'Oxford Button-Down Shirt', price: 1299, mrp: 2499, category: 'shirts', sizes: ['S','M','L','XL','XXL'], colors: ['#4a90d9','#fff'], tags: ['trending','bestseller'], stock: 15, emoji: '👔', description: 'Classic Oxford cotton shirt.', createdAt: '2024-01-20', soldCount: 289 },
  { id: 'p8', name: 'Checked Casual Shirt', price: 999, mrp: 1999, category: 'shirts', sizes: ['S','M','L','XL'], colors: ['#1a3a5c','#8b0000'], tags: ['trending'], stock: 10, emoji: '👔', description: 'Trendy checked pattern casual shirt.', createdAt: '2024-02-10', soldCount: 198 },
  { id: 'p9', name: 'Denim Shirt Classic', price: 1499, mrp: 2799, category: 'shirts', sizes: ['M','L','XL'], colors: ['#5b8fbe'], tags: ['bestseller','new'], stock: 7, emoji: '👔', description: 'Premium denim shirt vintage wash.', createdAt: '2024-03-05', soldCount: 234 },
  { id: 'p10', name: 'Premium Fleece Hoodie', price: 1999, mrp: 3999, category: 'hoodies', sizes: ['S','M','L','XL','XXL'], colors: ['#000','#2c3e50'], tags: ['trending','bestseller'], stock: 12, emoji: '🧥', description: 'Ultra-warm fleece-lined hoodie.', createdAt: '2024-01-25', soldCount: 387 },
  { id: 'p11', name: 'Zip-Up Sports Hoodie', price: 1799, mrp: 3499, category: 'hoodies', sizes: ['M','L','XL'], colors: ['#1a1a2e','#006400'], tags: ['trending','new'], stock: 8, emoji: '🧥', description: 'Athletic zip-up with moisture-wicking.', createdAt: '2024-03-15', soldCount: 198 },
  { id: 'p12', name: 'Classic Denim Jacket', price: 2499, mrp: 4999, category: 'jackets', sizes: ['S','M','L','XL'], colors: ['#5b8fbe','#2c2c2c'], tags: ['trending','bestseller'], stock: 6, emoji: '🥼', description: 'Timeless denim jacket washed finish.', createdAt: '2024-01-10', soldCount: 412 },
  { id: 'p13', name: 'Bomber Jacket Premium', price: 2999, mrp: 5499, category: 'jackets', sizes: ['M','L','XL'], colors: ['#000','#2c3e50'], tags: ['trending','new'], stock: 4, emoji: '🥼', description: 'Sleek bomber with ribbed collar.', createdAt: '2024-03-20', soldCount: 267 },
  { id: 'p14', name: 'Denim Bermuda Shorts', price: 899, mrp: 1799, category: 'shorts', sizes: ['28','30','32','34','36'], colors: ['#5b8fbe','#2c2c2c'], tags: ['trending','bestseller'], stock: 20, emoji: '🩳', description: 'Classic denim bermuda shorts.', createdAt: '2024-02-05', soldCount: 198 },
  { id: 'p15', name: 'Chino Casual Shorts', price: 799, mrp: 1499, category: 'shorts', sizes: ['28','30','32','34','36','38'], colors: ['#d2b48c','#2c3e50'], tags: ['new'], stock: 25, emoji: '🩳', description: 'Smart chino shorts belt loops.', createdAt: '2024-03-25', soldCount: 167 },
  { id: 'p16', name: 'Skinny Fit Stretch Jeans', price: 1699, mrp: 2999, category: 'jeans', sizes: ['28','30','32','34'], colors: ['#2c3e50','#1a1a1a'], tags: ['trending'], stock: 9, emoji: '👖', description: 'Ultra-comfortable skinny with elastane.', createdAt: '2024-02-15', soldCount: 189 },
  { id: 'p17', name: 'V-Neck Slim Fit Tee', price: 599, mrp: 1099, category: 'tshirts', sizes: ['S','M','L','XL','XXL'], colors: ['#4a6741','#000'], tags: ['new'], stock: 40, emoji: '👕', description: 'Slim fit v-neck premium cotton blend.', createdAt: '2024-03-28', soldCount: 167 },
  { id: 'p18', name: 'Linen Summer Shirt', price: 1199, mrp: 2299, category: 'shirts', sizes: ['S','M','L','XL'], colors: ['#f5f5dc','#87ceeb'], tags: ['new','trending'], stock: 14, emoji: '👔', description: 'Lightweight linen for summer.', createdAt: '2024-04-01', soldCount: 145 },
  { id: 'p19', name: 'Oversized Streetwear Hoodie', price: 2299, mrp: 4499, category: 'hoodies', sizes: ['M','L','XL','XXL'], colors: ['#000','#fff'], tags: ['trending','new'], stock: 6, emoji: '🧥', description: 'Oversized dropped shoulders urban style.', createdAt: '2024-04-05', soldCount: 234 },
  { id: 'p20', name: 'Leather Biker Jacket', price: 3499, mrp: 6999, category: 'jackets', sizes: ['M','L','XL'], colors: ['#000','#3d2b1f'], tags: ['bestseller'], stock: 3, emoji: '🥼', description: 'Premium faux leather asymmetric zip.', createdAt: '2024-01-30', soldCount: 189 },
];

const defaultCoupons: Coupon[] = [
  { code: 'FIRST15', discount: 15, minOrder: 499, expiry: '2025-12-31', active: true },
  { code: 'PJC20', discount: 20, minOrder: 1499, expiry: '2025-12-31', active: true },
  { code: 'FLASH30', discount: 30, minOrder: 1999, expiry: '2025-12-31', active: true },
  { code: 'WELCOME15', discount: 15, minOrder: 0, expiry: '2025-12-31', active: true },
  { code: 'STAYPJC', discount: 10, minOrder: 0, expiry: '2025-12-31', active: true },
];

interface StoreState {
  products: Product[];
  addProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  coupons: Coupon[];
  addCoupon: (c: Coupon) => void;
  deleteCoupon: (code: string) => void;
  flashOffers: FlashOffer[];
  addFlashOffer: (o: FlashOffer) => void;
  deleteFlashOffer: (id: string) => void;
  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;
  adminOffer: string | null;
  setAdminOffer: (text: string | null) => void;
  user: User | null;
  setUser: (u: User | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Products
      products: defaultProducts,
      addProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter(p => p.id !== id) })),

      // Cart
      cart: [],
      addToCart: (item) => set((s) => {
        const existing = s.cart.find(c => c.productId === item.productId && c.size === item.size && c.color === item.color);
        if (existing) {
          return { cart: s.cart.map(c => c.productId === item.productId && c.size === item.size && c.color === item.color ? { ...c, qty: c.qty + item.qty } : c) };
        }
        return { cart: [...s.cart, item] };
      }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter(c => c.productId !== id) })),
      updateQty: (id, qty) => set((s) => ({
        cart: qty <= 0 ? s.cart.filter(c => c.productId !== id) : s.cart.map(c => c.productId === id ? { ...c, qty } : c)
      })),
      clearCart: () => set({ cart: [] }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (id) => set((s) => ({
        wishlist: s.wishlist.includes(id) ? s.wishlist.filter(w => w !== id) : [...s.wishlist, id]
      })),

      // Coupons
      coupons: defaultCoupons,
      addCoupon: (c) => set((s) => ({ coupons: [c, ...s.coupons] })),
      deleteCoupon: (code) => set((s) => ({ coupons: s.coupons.filter(c => c.code !== code) })),

      // Flash Offers
      flashOffers: [],
      addFlashOffer: (o) => set((s) => ({ flashOffers: [o, ...s.flashOffers] })),
      deleteFlashOffer: (id) => set((s) => ({ flashOffers: s.flashOffers.filter(o => o.id !== id) })),

      // Orders
      orders: [],
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      updateOrderStatus: (id, status) => set((s) => ({
        orders: s.orders.map(o => o.id === id ? { ...o, status } : o)
      })),

      // Admin
      adminOffer: null,
      setAdminOffer: (text) => set({ adminOffer: text }),

      // Auth
      user: null,
      setUser: (u) => set({ user: u }),
    }),
    {
      name: 'pjc-store',
      partialize: (state) => ({
        products: state.products,
        cart: state.cart,
        wishlist: state.wishlist,
        coupons: state.coupons,
        flashOffers: state.flashOffers,
        orders: state.orders,
        adminOffer: state.adminOffer,
        user: state.user,
      }),
    }
  )
);
