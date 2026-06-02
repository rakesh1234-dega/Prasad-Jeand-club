import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { NotificationProvider } from '@/context/NotificationContext';
import AppWrapper from '@/components/AppWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a1a2e',
};

export const metadata: Metadata = {
  title: {
    default: 'Prasad Jeans Club - Premium Men\'s Fashion Store',
    template: '%s | Prasad Jeans Club',
  },
  description: 'Shop premium quality jeans, shirts, t-shirts, hoodies, jackets & more at Prasad Jeans Club. Best prices, fast delivery, easy returns across India.',
  keywords: ['men fashion', 'jeans', 'shirts', 't-shirts', 'hoodies', 'jackets', 'online shopping', 'Prasad Jeans Club', 'affordable fashion', 'India'],
  authors: [{ name: 'Prasad Jeans Club' }],
  creator: 'Prasad Jeans Club',
  publisher: 'Prasad Jeans Club',
  metadataBase: new URL('https://prasadjeans.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Prasad Jeans Club',
    title: 'Prasad Jeans Club - Style That Defines You',
    description: 'Premium men\'s fashion at affordable prices. Shop jeans, shirts, t-shirts & more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prasad Jeans Club - Premium Men\'s Fashion',
    description: 'Shop quality fashion at amazing prices',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pmcoqqoyuhmkgxfibsha.supabase.co" />
      </head>
      <body className="font-inter antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <NotificationProvider>
                  <AppWrapper>{children}</AppWrapper>
                </NotificationProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
