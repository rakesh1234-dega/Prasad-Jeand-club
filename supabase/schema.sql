-- ============================================================
-- PRASAD JEANS CLUB - Complete Database Schema
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 2. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  old_price NUMERIC(10,2) NOT NULL CHECK (old_price >= 0),
  discount INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  category TEXT NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  brand TEXT NOT NULL DEFAULT 'Prasad Jeans Club',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes for fast product queries
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_rating ON public.products(rating DESC);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_trending ON public.products(is_trending) WHERE is_trending = TRUE;
CREATE INDEX idx_products_best_seller ON public.products(is_best_seller) WHERE is_best_seller = TRUE;
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_search ON public.products USING gin(to_tsvector('english', name || ' ' || description || ' ' || category || ' ' || brand));

-- ============================================================
-- 3. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL DEFAULT ('PJC-' || LPAD(FLOOR(RANDOM() * 99999999)::TEXT, 8, '0')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  delivery_charge NUMERIC(10,2) DEFAULT 0 CHECK (delivery_charge >= 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned')),
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  tracking_id TEXT,
  coupon_code TEXT,
  notes TEXT,
  cancelled_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes for order queries
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);

-- ============================================================
-- 4. CART ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0 AND quantity <= 10),
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id, size, color)
);

CREATE INDEX idx_cart_user_id ON public.cart_items(user_id);

-- ============================================================
-- 5. WISHLIST TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user_id ON public.wishlist(user_id);

-- ============================================================
-- 6. ADDRESSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL CHECK (length(pincode) = 6),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);

-- Ensure only one default address per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.addresses SET is_default = FALSE
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER address_default_check
  AFTER INSERT OR UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.ensure_single_default_address();

-- ============================================================
-- 7. REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL CHECK (length(comment) >= 10 AND length(comment) <= 1000),
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Auto-update product rating when review added
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET 
    rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id))
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER review_rating_update
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();

-- ============================================================
-- 8. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('order', 'offer', 'price_drop', 'new_arrival', 'coupon', 'welcome', 'cart_reminder', 'update')),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================
-- 9. COUPONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  min_order NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_discount NUMERIC(10,2),
  expiry_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  usage_limit INTEGER DEFAULT 1000,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active ON public.coupons(is_active) WHERE is_active = TRUE;

-- ============================================================
-- 10. ORDER STATUS HISTORY (for tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_order_history_order_id ON public.order_status_history(order_id);

-- Auto-track order status changes
CREATE OR REPLACE FUNCTION public.track_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, status, note)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || OLD.status || ' to ' || NEW.status);
    
    -- Create notification for user
    INSERT INTO public.notifications (user_id, title, message, type, metadata)
    VALUES (
      NEW.user_id,
      CASE NEW.status
        WHEN 'confirmed' THEN 'Order Confirmed!'
        WHEN 'shipped' THEN 'Order Shipped!'
        WHEN 'out_for_delivery' THEN 'Out for Delivery!'
        WHEN 'delivered' THEN 'Order Delivered!'
        WHEN 'cancelled' THEN 'Order Cancelled'
        ELSE 'Order Updated'
      END,
      CASE NEW.status
        WHEN 'confirmed' THEN 'Your order #' || NEW.order_number || ' has been confirmed.'
        WHEN 'shipped' THEN 'Your order #' || NEW.order_number || ' is on the way!'
        WHEN 'out_for_delivery' THEN 'Your order #' || NEW.order_number || ' will arrive today!'
        WHEN 'delivered' THEN 'Your order #' || NEW.order_number || ' has been delivered.'
        WHEN 'cancelled' THEN 'Your order #' || NEW.order_number || ' has been cancelled.'
        ELSE 'Your order #' || NEW.order_number || ' status updated to ' || NEW.status
      END,
      'order',
      jsonb_build_object('order_id', NEW.id, 'order_number', NEW.order_number, 'status', NEW.status)
    );

    -- Set delivered_at timestamp
    IF NEW.status = 'delivered' THEN
      NEW.delivered_at = NOW();
    END IF;
    IF NEW.status = 'cancelled' THEN
      NEW.cancelled_at = NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER order_status_tracker
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.track_order_status();

-- ============================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- PRODUCTS: Everyone can read active products (public catalog)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = TRUE);

-- ORDERS: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id AND status = 'placed');

-- CART: Users manage their own cart
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- WISHLIST: Users manage their own wishlist
CREATE POLICY "Users can view own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from own wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- ADDRESSES: Users manage their own addresses
CREATE POLICY "Users can view own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- REVIEWS: Anyone can read, users can create/update their own
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- NOTIFICATIONS: Users see only their own
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- COUPONS: Everyone can read active coupons
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = TRUE AND expiry_date >= CURRENT_DATE);

-- ORDER HISTORY: Users can see their own order history
CREATE POLICY "Users can view own order history" ON public.order_status_history FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid()));

-- ============================================================
-- 12. SEED DATA - COUPONS
-- ============================================================
INSERT INTO public.coupons (code, discount_percent, min_order, max_discount, expiry_date, usage_limit) VALUES
  ('PRASAD10', 10, 999, 500, '2025-12-31', 10000),
  ('PRASAD20', 20, 1999, 1000, '2025-12-31', 5000),
  ('FIRST50', 50, 499, 500, '2025-12-31', 1000),
  ('SUMMER15', 15, 1499, 750, '2025-08-31', 3000),
  ('WELCOME10', 10, 0, 300, '2025-12-31', 100000)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 13. SEED DATA - PRODUCTS
-- ============================================================
INSERT INTO public.products (name, description, price, old_price, discount, category, sizes, colors, images, rating, reviews_count, stock, is_featured, is_trending, is_best_seller, brand) VALUES
  ('Classic Slim Fit Jeans', 'Premium quality slim fit jeans with stretch denim fabric. Perfect for casual and semi-formal occasions. Features 5-pocket design with brass rivets.', 1499, 2999, 50, 'jeans', ARRAY['28','30','32','34','36','38'], ARRAY['#1a3a5c','#2c2c2c','#4a6741'], ARRAY['/images/jeans-1.jpg'], 4.5, 234, 50, TRUE, TRUE, TRUE, 'Prasad Jeans Club'),
  ('Ripped Distressed Denim', 'Trendy ripped jeans with distressed look. Made from high-quality cotton denim with comfortable fit.', 1799, 3499, 49, 'jeans', ARRAY['28','30','32','34','36'], ARRAY['#5b8fbe','#2c2c2c'], ARRAY['/images/jeans-2.jpg'], 4.3, 156, 35, FALSE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Straight Fit Dark Wash', 'Classic straight fit jeans in dark wash. Timeless style with durable construction.', 1299, 2499, 48, 'jeans', ARRAY['30','32','34','36','38','40'], ARRAY['#1a1a3e','#3d3d3d'], ARRAY['/images/jeans-3.jpg'], 4.6, 312, 80, TRUE, FALSE, TRUE, 'Prasad Jeans Club'),
  ('Skinny Fit Stretch Jeans', 'Ultra-comfortable skinny fit jeans with 2% elastane for maximum stretch and flexibility.', 1699, 2999, 43, 'jeans', ARRAY['28','30','32','34'], ARRAY['#2c3e50','#1a1a1a','#4a4a4a'], ARRAY['/images/jeans-4.jpg'], 4.2, 189, 45, FALSE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Relaxed Fit Cargo Jeans', 'Relaxed fit cargo jeans with multiple pockets. Perfect for outdoor activities and casual wear.', 1899, 3299, 42, 'jeans', ARRAY['30','32','34','36','38'], ARRAY['#5c4033','#2c2c2c','#3d5c3a'], ARRAY['/images/jeans-5.jpg'], 4.4, 98, 30, TRUE, FALSE, FALSE, 'Prasad Jeans Club'),
  ('Premium Cotton Round Neck Tee', 'Super soft 100% combed cotton t-shirt. Breathable fabric perfect for everyday wear.', 499, 999, 50, 'tshirts', ARRAY['S','M','L','XL','XXL'], ARRAY['#ffffff','#000000','#1a3a5c','#8b0000','#006400'], ARRAY['/images/tshirt-1.jpg'], 4.7, 456, 200, TRUE, TRUE, TRUE, 'Prasad Jeans Club'),
  ('Graphic Print Oversized Tee', 'Trendy oversized t-shirt with unique graphic print. Drop shoulder design for a streetwear look.', 699, 1299, 46, 'tshirts', ARRAY['M','L','XL','XXL'], ARRAY['#000000','#ffffff','#2c3e50'], ARRAY['/images/tshirt-2.jpg'], 4.4, 278, 120, FALSE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Polo Neck Classic Tee', 'Classic polo neck t-shirt with embroidered logo. Perfect for smart-casual occasions.', 799, 1499, 47, 'tshirts', ARRAY['S','M','L','XL'], ARRAY['#1a1a2e','#8b0000','#006400','#ffffff'], ARRAY['/images/tshirt-3.jpg'], 4.5, 345, 90, TRUE, FALSE, TRUE, 'Prasad Jeans Club'),
  ('V-Neck Slim Fit Tee', 'Slim fit v-neck t-shirt in premium cotton blend. Lightweight and breathable for summer.', 599, 1099, 45, 'tshirts', ARRAY['S','M','L','XL','XXL'], ARRAY['#4a6741','#1a3a5c','#8b4513','#000000'], ARRAY['/images/tshirt-4.jpg'], 4.3, 167, 75, FALSE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Oxford Button-Down Shirt', 'Classic Oxford cotton shirt with button-down collar. Perfect for office and casual outings.', 1299, 2499, 48, 'shirts', ARRAY['S','M','L','XL','XXL'], ARRAY['#4a90d9','#ffffff','#f5f5dc'], ARRAY['/images/shirt-1.jpg'], 4.6, 289, 70, TRUE, TRUE, TRUE, 'Prasad Jeans Club'),
  ('Checked Casual Shirt', 'Trendy checked pattern casual shirt. Soft cotton fabric with a relaxed fit.', 999, 1999, 50, 'shirts', ARRAY['S','M','L','XL'], ARRAY['#1a3a5c','#8b0000','#006400'], ARRAY['/images/shirt-2.jpg'], 4.3, 198, 55, FALSE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Denim Shirt Classic', 'Premium denim shirt with pearl snap buttons. Vintage wash for a rugged look.', 1499, 2799, 46, 'shirts', ARRAY['M','L','XL','XXL'], ARRAY['#5b8fbe','#2c3e50'], ARRAY['/images/shirt-3.jpg'], 4.5, 234, 40, TRUE, FALSE, TRUE, 'Prasad Jeans Club'),
  ('Linen Summer Shirt', 'Lightweight linen shirt perfect for summer. Breathable fabric keeps you cool all day.', 1199, 2299, 48, 'shirts', ARRAY['S','M','L','XL'], ARRAY['#f5f5dc','#87ceeb','#ffffff','#d2b48c'], ARRAY['/images/shirt-4.jpg'], 4.4, 145, 35, FALSE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Premium Fleece Pullover Hoodie', 'Ultra-warm fleece-lined hoodie with kangaroo pocket. Ribbed cuffs and hem for a snug fit.', 1999, 3999, 50, 'hoodies', ARRAY['S','M','L','XL','XXL'], ARRAY['#000000','#2c3e50','#8b0000','#4a4a4a'], ARRAY['/images/hoodie-1.jpg'], 4.7, 387, 60, TRUE, TRUE, TRUE, 'Prasad Jeans Club'),
  ('Zip-Up Sports Hoodie', 'Athletic zip-up hoodie with moisture-wicking fabric. Perfect for workouts and casual wear.', 1799, 3499, 49, 'hoodies', ARRAY['M','L','XL','XXL'], ARRAY['#1a1a2e','#2c3e50','#006400'], ARRAY['/images/hoodie-2.jpg'], 4.4, 198, 40, FALSE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Oversized Streetwear Hoodie', 'Trendy oversized hoodie with dropped shoulders. Urban streetwear style with bold graphics.', 2299, 4499, 49, 'hoodies', ARRAY['M','L','XL','XXL'], ARRAY['#000000','#ffffff','#4a4a4a'], ARRAY['/images/hoodie-3.jpg'], 4.5, 234, 30, TRUE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Classic Denim Jacket', 'Timeless denim jacket with button closure. Washed finish for a vintage appeal.', 2499, 4999, 50, 'jackets', ARRAY['S','M','L','XL','XXL'], ARRAY['#5b8fbe','#2c2c2c','#1a3a5c'], ARRAY['/images/jacket-1.jpg'], 4.8, 412, 35, TRUE, TRUE, TRUE, 'Prasad Jeans Club'),
  ('Bomber Jacket Premium', 'Sleek bomber jacket with ribbed collar and cuffs. Satin-finish exterior with padded interior.', 2999, 5499, 45, 'jackets', ARRAY['M','L','XL','XXL'], ARRAY['#000000','#2c3e50','#006400'], ARRAY['/images/jacket-2.jpg'], 4.6, 267, 25, TRUE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Leather Biker Jacket', 'Premium faux leather biker jacket with asymmetric zip. Edgy style with quilted shoulders.', 3499, 6999, 50, 'jackets', ARRAY['M','L','XL'], ARRAY['#000000','#3d2b1f'], ARRAY['/images/jacket-3.jpg'], 4.7, 189, 20, TRUE, FALSE, TRUE, 'Prasad Jeans Club'),
  ('Windbreaker Sports Jacket', 'Lightweight windbreaker with water-resistant coating. Packable design for travel and sports.', 1899, 3499, 46, 'jackets', ARRAY['S','M','L','XL','XXL'], ARRAY['#1a1a2e','#e94560','#f5a623','#006400'], ARRAY['/images/jacket-4.jpg'], 4.3, 145, 50, FALSE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Denim Bermuda Shorts', 'Classic denim bermuda shorts with 5-pocket design. Perfect for summer casual wear.', 899, 1799, 50, 'shorts', ARRAY['28','30','32','34','36'], ARRAY['#5b8fbe','#2c2c2c','#1a3a5c'], ARRAY['/images/shorts-1.jpg'], 4.4, 198, 70, TRUE, TRUE, TRUE, 'Prasad Jeans Club'),
  ('Chino Casual Shorts', 'Smart chino shorts with belt loops. Versatile style from beach to brunch.', 799, 1499, 47, 'shorts', ARRAY['28','30','32','34','36','38'], ARRAY['#d2b48c','#2c3e50','#006400','#f5f5dc'], ARRAY['/images/shorts-2.jpg'], 4.3, 167, 60, FALSE, TRUE, FALSE, 'Prasad Jeans Club'),
  ('Athletic Running Shorts', 'Lightweight running shorts with built-in brief. Quick-dry fabric for intense workouts.', 599, 1199, 50, 'shorts', ARRAY['S','M','L','XL','XXL'], ARRAY['#000000','#1a1a2e','#e94560','#006400'], ARRAY['/images/shorts-3.jpg'], 4.5, 234, 100, FALSE, FALSE, TRUE, 'Prasad Jeans Club'),
  ('Cargo Utility Shorts', 'Rugged cargo shorts with multiple pockets. Durable fabric for outdoor adventures.', 999, 1999, 50, 'shorts', ARRAY['30','32','34','36','38'], ARRAY['#5c4033','#4a6741','#2c2c2c'], ARRAY['/images/shorts-4.jpg'], 4.2, 145, 45, FALSE, TRUE, FALSE, 'Prasad Jeans Club')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 14. FUNCTION: Validate & Apply Coupon (secure server-side)
-- ============================================================
CREATE OR REPLACE FUNCTION public.validate_coupon(p_code TEXT, p_order_total NUMERIC)
RETURNS TABLE(is_valid BOOLEAN, discount_percent INTEGER, max_discount NUMERIC, message TEXT) AS $$
DECLARE
  v_coupon RECORD;
BEGIN
  SELECT * INTO v_coupon FROM public.coupons 
  WHERE code = UPPER(p_code) AND is_active = TRUE AND expiry_date >= CURRENT_DATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 0::NUMERIC, 'Invalid or expired coupon code'::TEXT;
    RETURN;
  END IF;

  IF v_coupon.used_count >= v_coupon.usage_limit THEN
    RETURN QUERY SELECT FALSE, 0, 0::NUMERIC, 'Coupon usage limit reached'::TEXT;
    RETURN;
  END IF;

  IF p_order_total < v_coupon.min_order THEN
    RETURN QUERY SELECT FALSE, 0, 0::NUMERIC, ('Minimum order of ₹' || v_coupon.min_order || ' required')::TEXT;
    RETURN;
  END IF;

  RETURN QUERY SELECT TRUE, v_coupon.discount_percent, COALESCE(v_coupon.max_discount, 99999)::NUMERIC, 'Coupon applied successfully!'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 15. FUNCTION: Decrement stock on order placement
-- ============================================================
CREATE OR REPLACE FUNCTION public.decrement_stock(p_items JSONB)
RETURNS BOOLEAN AS $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    UPDATE public.products
    SET stock = stock - (item.value->>'quantity')::INTEGER
    WHERE id = (item.value->'product'->>'id')::UUID
    AND stock >= (item.value->>'quantity')::INTEGER;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient stock for product %', item.value->'product'->>'name';
    END IF;
  END LOOP;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- DONE! Your database is ready for production.
-- ============================================================
