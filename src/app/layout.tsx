import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { NotificationProvider } from '@/context/NotificationContext';
import AppWrapper from '@/components/AppWrapper';

export const metadata: Metadata = {
  title: 'Prasad Jeans Club - Style That Defines You',
  description: 'Premium men\'s fashion store. Shop jeans, shirts, t-shirts, hoodies, jackets and more at amazing prices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-inter">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <NotificationProvider>
                <AppWrapper>{children}</AppWrapper>
              </NotificationProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
