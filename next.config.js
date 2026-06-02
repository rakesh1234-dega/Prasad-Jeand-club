/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================
  // IMAGE OPTIMIZATION
  // ============================================
  images: {
    domains: [
      'images.unsplash.com',
      'pmcoqqoyuhmkgxfibsha.supabase.co', // Supabase Storage
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ============================================
  // PERFORMANCE & CACHING
  // ============================================
  
  // Enable React strict mode for catching bugs
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Power off X-Powered-By header (security)
  poweredByHeader: false,

  // Production source maps (disabled for faster builds & security)
  productionBrowserSourceMaps: false,

  // ============================================
  // HEADERS (additional security + caching)
  // ============================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache fonts
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // API routes - no cache
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },

  // ============================================
  // REDIRECTS
  // ============================================
  async redirects() {
    return [
      // Redirect old URLs if any
      { source: '/home', destination: '/', permanent: true },
      { source: '/products', destination: '/shop', permanent: true },
      { source: '/products/:path*', destination: '/shop/:path*', permanent: true },
    ];
  },

  // ============================================
  // EXPERIMENTAL FEATURES
  // ============================================
  experimental: {
    // Optimize package imports (tree-shaking)
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
