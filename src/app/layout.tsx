import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { plusJakarta } from '@/theme/fonts';

export const metadata: Metadata = {
  title: 'Seller Dashboard — Amazon SP-API Profit Analytics',
  description: 'Private Amazon SP-API dashboard for India sellers. Track orders, inventory, finance, COGS, and actual profit per product.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body className={plusJakarta.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
