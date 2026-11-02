import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin',
});

export const metadata: Metadata = {
  title: 'BookNook',
  description: 'A small online library. Add a book, borrow a book, return a book.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={josefinSans.variable}>
      <body className="flex min-h-screen flex-col bg-[#FBF6EE] text-[#3E2A1E]">
        <Toaster position="top-center" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}