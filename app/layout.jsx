
import { Inter } from 'next/font/google';
import './globals.css';
import { AppClientShell } from '@/components/layout/app-client-shell';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'MediBook | Hospital Appointment Booking',
  description: 'Easily book your hospital appointments online with MediBook.',
};

export default function RootLayout({
  children,
}) {
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
