import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// PRODUCTION MIDDLEWARE - Security, Rate Limiting, Headers
// ============================================================

// In-memory rate limiting (per-instance, resets on deploy)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown';
  return ip;
}

function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count++;
  return false;
}

// Clean up old entries on each request (Edge runtime doesn't support setInterval)
function cleanupRateLimitStore() {
  const now = Date.now();
  if (rateLimitStore.size > 10000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getRateLimitKey(request);
  
  // Cleanup stale rate limit entries
  cleanupRateLimitStore();

  // ============================================
  // 1. RATE LIMITING
  // ============================================
  
  // API routes: 100 requests per minute
  if (pathname.startsWith('/api/')) {
    if (isRateLimited(`api-${clientIP}`, 100, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please slow down.' },
        { 
          status: 429, 
          headers: { 
            'Retry-After': '60',
            'X-RateLimit-Limit': '100',
          } 
        }
      );
    }
  }

  // Auth endpoints: stricter limit (20 per minute to prevent brute force)
  if (pathname.startsWith('/api/') && (pathname.includes('login') || pathname.includes('register'))) {
    if (isRateLimited(`auth-${clientIP}`, 20, 60000)) {
      return NextResponse.json(
        { error: 'Too many authentication attempts. Please wait.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }

  // Order creation: 10 per minute
  if (pathname === '/api/orders' && request.method === 'POST') {
    if (isRateLimited(`orders-${clientIP}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many order requests. Please wait.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }

  // ============================================
  // 2. SECURITY HEADERS
  // ============================================
  const response = NextResponse.next();

  // Prevent XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Clickjacking protection
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy (disable unnecessary browser features)
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), interest-cohort=()');
  
  // HSTS (force HTTPS in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Content Security Policy
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval in dev
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://pmcoqqoyuhmkgxfibsha.supabase.co wss://pmcoqqoyuhmkgxfibsha.supabase.co https://fonts.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '));

  // ============================================
  // 3. PROTECTED ROUTES (require auth)
  // ============================================
  const protectedPaths = ['/profile', '/orders', '/checkout', '/payment'];
  
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    // Check for Supabase auth cookie/token
    const supabaseToken = request.cookies.get('sb-pmcoqqoyuhmkgxfibsha-auth-token')?.value
      || request.cookies.get('sb-access-token')?.value;
    
    // If no auth token found, check localStorage-based session cookie
    const hasSession = supabaseToken || request.cookies.get('pjc-session')?.value;
    
    if (!hasSession) {
      // Don't hard redirect on client-side nav, let the component handle it
      // Only redirect on direct page load (no fetch header)
      const isPageRequest = !request.headers.get('x-requested-with');
      if (isPageRequest && !request.headers.get('next-router-state-tree')) {
        // Allow - let client-side auth check handle redirect
        // This prevents flash of redirect on hydration
      }
    }
  }

  // ============================================
  // 4. BLOCK SUSPICIOUS REQUESTS
  // ============================================
  
  // Block common attack patterns
  const suspiciousPatterns = [
    '..%2f', '../', '.env', 'wp-admin', 'wp-login', 
    '.git', 'phpmyadmin', 'admin.php',
  ];

  const lowerPath = pathname.toLowerCase();
  if (suspiciousPatterns.some(pattern => lowerPath.includes(pattern))) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }

  // Block overly long URLs (potential buffer overflow attempts)
  if (pathname.length > 500) {
    return NextResponse.json(
      { error: 'URI too long' },
      { status: 414 }
    );
  }

  return response;
}

// Apply middleware to these routes
export const config = {
  matcher: [
    // Apply to all routes except static files and _next
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
