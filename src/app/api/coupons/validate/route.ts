import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { checkRateLimit, sanitizeString } from '@/lib/validation';

// POST /api/coupons/validate - Validate a coupon code
export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`coupon-${clientIP}`, 20, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const code = sanitizeString(String(body.code || '')).toUpperCase();
    const orderTotal = Number(body.orderTotal) || 0;

    if (!code || code.length < 3 || code.length > 20) {
      return NextResponse.json(
        { valid: false, error: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    if (orderTotal <= 0) {
      return NextResponse.json(
        { valid: false, error: 'Invalid order total' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .rpc('validate_coupon', { p_code: code, p_order_total: orderTotal });

    if (error) {
      return NextResponse.json(
        { valid: false, error: 'Failed to validate coupon' },
        { status: 500 }
      );
    }

    if (data && (data as any)[0]) {
      const result = (data as any)[0];
      if (result.is_valid) {
        const discount = (orderTotal * result.discount_percent) / 100;
        const cappedDiscount = Math.min(discount, result.max_discount);
        
        return NextResponse.json({
          valid: true,
          discountPercent: result.discount_percent,
          discountAmount: cappedDiscount,
          message: result.message,
        });
      } else {
        return NextResponse.json({
          valid: false,
          error: result.message,
        });
      }
    }

    return NextResponse.json({ valid: false, error: 'Coupon not found' });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
