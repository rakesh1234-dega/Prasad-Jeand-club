# Prasad Jeans Club 🛍️

A full-featured eCommerce website for men's fashion built with Next.js 14, Tailwind CSS, TypeScript, and Supabase.

## Features

- **Splash Screen** with animated logo
- **Authentication** (Login/Register with demo account)
- **20+ Pages** - Full eCommerce flow
- **Flash Deals Timer** - Countdown-based offers
- **Notifications System** - Order updates, offers, arrivals
- **Animated Category Dropdown** - Horizontal with stagger animation
- **Product Management** - Grid view, filters, sorting
- **Cart & Checkout** - Full purchase flow
- **Wishlist** - Save favorites
- **Order Tracking** - Visual timeline
- **Responsive Design** - Mobile-first
- **Smooth Animations** throughout

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (ready for backend integration)

## Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd prasad-jeans-club
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and add your Supabase keys:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Account

- Email: `demo@prasadjeans.com`
- Password: `demo123`

## Pages

| # | Page | Route |
|---|------|-------|
| 0 | Splash Screen | (auto on first visit) |
| 1 | Home | `/` |
| 2 | Shop All | `/shop` |
| 3 | Category | `/shop/[category]` |
| 4 | Product Detail | `/product/[id]` |
| 5 | Search | `/search?q=...` |
| 6 | Cart | `/cart` |
| 7 | Checkout | `/checkout` |
| 8 | Order Success | `/order-success` |
| 9 | Login | `/login` |
| 10 | Register | `/register` |
| 11 | Profile | `/profile` |
| 12 | Wishlist | `/wishlist` |
| 13 | Orders | `/orders` |
| 14 | About | `/about` |
| 15 | Contact | `/contact` |
| 16 | FAQ | `/faq` |
| 17 | Privacy | `/privacy` |
| 18 | Terms | `/terms` |
| 19 | Returns | `/returns` |

## Coupon Codes

- `PRASAD10` - 10% off (min ₹999)
- `PRASAD20` - 20% off (min ₹1999)
- `FIRST50` - 50% off (min ₹499)
- `SUMMER15` - 15% off (min ₹1499)

## Categories

- T-Shirts (`/shop/tshirts`)
- Shirts (`/shop/shirts`)
- Jeans (`/shop/jeans`)
- Hoodies (`/shop/hoodies`)
- Jackets (`/shop/jackets`)
- Shorts (`/shop/shorts`)
