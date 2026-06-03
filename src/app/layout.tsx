import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prasad Jeans Club — Premium Men\'s Fashion',
  description: 'Shop premium jeans, shirts, t-shirts, hoodies, jackets & more. Best prices, fast delivery, easy returns across India.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body bg-[#0D0D0D] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
