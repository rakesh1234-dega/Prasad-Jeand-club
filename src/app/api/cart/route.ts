import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/validation';

// Helper to get authenticated user
async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

// GET /api/cart - Get user's cart (synced with DB)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        size,
        color,
        product_id,
        products (
          id, name, price, old_price, discount, category, sizes, colors, images, rating, reviews_count, stock, brand
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }

    return NextResponse.json({ items: cartItems || [] });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`cart-${clientIP}`, 60, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1, size, color } = body;

    if (!productId || !size || !color) {
      return NextResponse.json({ error: 'Product ID, size, and color are required' }, { status: 400 });
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: 'Quantity must be between 1 and 10' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Check product exists and is in stock
    const { data: product } = await supabase
      .from('products')
      .select('id, stock, is_active')
      .eq('id', productId)
      .single();

    if (!product || !product.is_active) {
      return NextResponse.json({ error: 'Product not available' }, { status: 400 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: `Only ${product.stock} units available` }, { status: 400 });
    }

    // Check existing cart count (max 20 items)
    const { count } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if ((count || 0) >= 20) {
      return NextResponse.json({ error: 'Cart limit reached (max 20 items)' }, { status: 400 });
    }

    // Upsert cart item (add or update quantity)
    const { data, error } = await supabase
      .from('cart_items')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          quantity,
          size,
          color,
        },
        { onConflict: 'user_id,product_id,size,color' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json({ error: 'Cart item ID required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
