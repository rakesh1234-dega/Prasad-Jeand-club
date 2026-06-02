export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          old_price: number
          discount: number
          category: string
          sizes: string[]
          colors: string[]
          images: string[]
          rating: number
          reviews_count: number
          stock: number
          is_featured: boolean
          is_trending: boolean
          is_best_seller: boolean
          brand: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          old_price: number
          discount: number
          category: string
          sizes: string[]
          colors: string[]
          images: string[]
          rating?: number
          reviews_count?: number
          stock: number
          is_featured?: boolean
          is_trending?: boolean
          is_best_seller?: boolean
          brand: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string
          price?: number
          old_price?: number
          discount?: number
          category?: string
          sizes?: string[]
          colors?: string[]
          images?: string[]
          rating?: number
          reviews_count?: number
          stock?: number
          is_featured?: boolean
          is_trending?: boolean
          is_best_seller?: boolean
          brand?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: Json
          subtotal: number
          discount_amount: number
          delivery_charge: number
          total: number
          status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'
          shipping_address: Json
          payment_method: string
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_id: string | null
          coupon_code: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          items: Json
          subtotal: number
          discount_amount?: number
          delivery_charge?: number
          total: number
          status?: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'
          shipping_address: Json
          payment_method: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_id?: string | null
          coupon_code?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          items?: Json
          subtotal?: number
          discount_amount?: number
          delivery_charge?: number
          total?: number
          status?: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'
          shipping_address?: Json
          payment_method?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_id?: string | null
          coupon_code?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          size: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          size: string
          color: string
          created_at?: string
        }
        Update: {
          quantity?: number
          size?: string
          color?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {}
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          address: string
          city: string
          state: string
          pincode: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          address: string
          city: string
          state: string
          pincode: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          pincode?: string
          is_default?: boolean
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          rating?: number
          comment?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_percent: number
          min_order: number
          max_discount: number | null
          expiry_date: string
          is_active: boolean
          usage_limit: number
          used_count: number
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_percent: number
          min_order: number
          max_discount?: number | null
          expiry_date: string
          is_active?: boolean
          usage_limit?: number
          used_count?: number
          created_at?: string
        }
        Update: {
          discount_percent?: number
          min_order?: number
          max_discount?: number | null
          expiry_date?: string
          is_active?: boolean
          usage_limit?: number
          used_count?: number
        }
      }
    }
  }
}
