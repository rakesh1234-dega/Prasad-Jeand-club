// Input validation & sanitization for production security

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML injection
    .slice(0, 500); // Limit length
}

export function validateEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-+()]/g, '');
  return /^\d{10,13}$/.test(cleaned);
}

export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode.trim());
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
  if (password.length > 128) return { valid: false, error: 'Password too long' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain at least one uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Password must contain at least one lowercase letter' };
  if (!/\d/.test(password)) return { valid: false, error: 'Password must contain at least one number' };
  return { valid: true };
}

export function validateOrderItems(items: any[]): { valid: boolean; error?: string } {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }
  if (items.length > 20) {
    return { valid: false, error: 'Too many items in cart (max 20)' };
  }
  
  for (const item of items) {
    if (!item.product?.id || !item.quantity || !item.size || !item.color) {
      return { valid: false, error: 'Invalid item in cart' };
    }
    if (item.quantity < 1 || item.quantity > 10) {
      return { valid: false, error: 'Invalid quantity (1-10 allowed)' };
    }
    if (typeof item.product.price !== 'number' || item.product.price <= 0) {
      return { valid: false, error: 'Invalid product price' };
    }
  }
  return { valid: true };
}

export function validateAddress(address: any): { valid: boolean; error?: string } {
  if (!address) return { valid: false, error: 'Address is required' };
  if (!address.name || address.name.trim().length < 2) return { valid: false, error: 'Name is required' };
  if (!validatePhone(address.phone || '')) return { valid: false, error: 'Valid phone number is required' };
  if (!address.address || address.address.trim().length < 10) return { valid: false, error: 'Complete address is required' };
  if (!address.city || address.city.trim().length < 2) return { valid: false, error: 'City is required' };
  if (!address.state || address.state.trim().length < 2) return { valid: false, error: 'State is required' };
  if (!validatePincode(address.pincode || '')) return { valid: false, error: 'Valid 6-digit pincode is required' };
  return { valid: true };
}

// Rate limiting helper (in-memory for edge/serverless)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests = 30, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = requestCounts.get(identifier);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false; // Rate limited
  }

  entry.count++;
  return true;
}

// Sanitize order data before storing
export function sanitizeOrderData(data: any) {
  return {
    items: data.items?.map((item: any) => ({
      product: {
        id: String(item.product?.id || ''),
        name: sanitizeString(String(item.product?.name || '')),
        price: Number(item.product?.price) || 0,
        oldPrice: Number(item.product?.oldPrice) || 0,
        category: sanitizeString(String(item.product?.category || '')),
        brand: sanitizeString(String(item.product?.brand || '')),
      },
      quantity: Math.min(Math.max(1, Number(item.quantity) || 1), 10),
      size: sanitizeString(String(item.size || '')),
      color: sanitizeString(String(item.color || '')),
    })),
    shippingAddress: {
      name: sanitizeString(String(data.shippingAddress?.name || '')),
      phone: String(data.shippingAddress?.phone || '').replace(/[^\d+]/g, ''),
      address: sanitizeString(String(data.shippingAddress?.address || '')),
      city: sanitizeString(String(data.shippingAddress?.city || '')),
      state: sanitizeString(String(data.shippingAddress?.state || '')),
      pincode: String(data.shippingAddress?.pincode || '').replace(/\D/g, '').slice(0, 6),
    },
    paymentMethod: sanitizeString(String(data.paymentMethod || 'cod')),
    couponCode: data.couponCode ? sanitizeString(String(data.couponCode)).toUpperCase() : null,
    deliveryType: data.deliveryType === 'express' ? 'express' : 'standard',
  };
}
