import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { 
  validateOrderItems, 
  validateAddress, 
  sanitizeOrderData, 
  checkRateLimit 
} from '@/lib/validation';

// POST /api/orders - Create a new order (secure, server-side)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`order-${clientIP}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before placing another order.' },
        { status: 429 }
      );
    }

    // Get auth token from request
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required. Please login to place an order.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createServerClient();

    // Verify user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid session. Please login again.' },
        { status: 401 }
      );
    }

    // Parse and sanitize request body
    const rawBody = await request.json();
    const body = sanitizeOrderData(rawBody);

    // Validate cart items
    const itemsValidation = validateOrderItems(body.items);
    if (!itemsValidation.valid) {
      return NextResponse.json(
        { error: itemsValidation.error },
        { status: 400 }
      );
    }

    // Validate shipping address
    const addressValidation = validateAddress(body.shippingAddress);
    if (!addressValidation.valid) {
      return NextResponse.json(
        { error: addressValidation.error },
        { status: 400 }
      );
    }

    // Calculate totals server-side (never trust client-side calculations)
    let subtotal = 0;
    for (const item of body.items) {
      // Verify price from database
      const { data: product } = await supabase
        .from('products')
        .select('price, stock, is_active')
        .eq('id', item.product.id)
        .single();

      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: `Product "${item.product.name}" is no longer available.` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Only ${product.stock} units of "${item.product.name}" available.` },
          { status: 400 }
        );
      }

      // Use server-verified price, not client-sent price
      subtotal += product.price * item.quantity;
    }

    // Apply coupon if provided
    let discountAmount = 0;
    if (body.couponCode) {
      const { data: couponResult } = await supabase
        .rpc('validate_coupon', { p_code: body.couponCode, p_order_total: subtotal });

      if (couponResult && couponResult[0]?.is_valid) {
        const discount = (subtotal * couponResult[0].discount_percent) / 100;
        discountAmount = Math.min(discount, couponResult[0].max_discount);
        
        // Increment coupon usage
        await supabase
          .from('coupons')
          .update({ used_count: couponResult[0].used_count + 1 })
          .eq('code', body.couponCode);
      }
    }

    // Calculate delivery charge
    const deliveryCharge = body.deliveryType === 'express' ? 99 : (subtotal >= 999 ? 0 : 99);
    const total = subtotal - discountAmount + deliveryCharge;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        items: body.items,
        subtotal,
        discount_amount: discountAmount,
        delivery_charge: deliveryCharge,
        total,
        status: 'placed',
        shipping_address: body.shippingAddress,
        payment_method: body.paymentMethod,
        payment_status: body.paymentMethod === 'cod' ? 'pending' : 'paid',
        coupon_code: body.couponCode,
      })
      .select('id, order_number, total, status, created_at')
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
        { status: 500 }
      );
    }

    // Decrement stock for each product
    await supabase.rpc('decrement_stock', { p_items: body.items });

    // Clear user's cart after successful order
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    // Create order notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Order Placed Successfully!',
        message: `Your order #${order.order_number} has been placed. Total: ₹${total.toLocaleString()}. Expected delivery in ${body.deliveryType === 'express' ? '2-3' : '5-7'} business days.`,
        type: 'order',
        metadata: { order_id: order.id, order_number: order.order_number },
      });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        total: order.total,
        status: order.status,
        createdAt: order.created_at,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({
      orders: orders || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
