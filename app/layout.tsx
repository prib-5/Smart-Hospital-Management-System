
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppClientShell } from '@/components/layout/app-client-shell';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MediBook | Hospital Appointment Booking',
  description: 'Easily book your hospital appointments online with MediBook.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased flex flex-col bg-background text-foreground min-h-screen`}>
        <AppClientShell>
          {children}
        </AppClientShell>
      </body>
    </html>
  );
}
