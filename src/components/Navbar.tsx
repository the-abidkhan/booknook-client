'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'All Books', href: '/books' },
  { name: 'Add Book', href: '/add-book' },
  { name: 'My Books', href: '/my-books' },
  { name: 'My Borrows', href: '/my-borrows' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `whitespace-nowrap rounded-lg px-4 py-2 font-semibold transition-colors ${
      pathname === href
        ? 'bg-[#8B4A2B] text-white'
        : 'text-[#3E2A1E] hover:bg-[#EAD9C0] hover:text-[#8B4A2B]'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E3D3BC] bg-[#F5EBDD]">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <BookOpen className="h-7 w-7 text-[#8B4A2B]" strokeWidth={2.2} />
            <span className="text-[#3E2A1E]">BookNook</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={linkClass(link.href)}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 font-semibold text-[#3E2A1E] transition-colors hover:bg-[#EAD9C0] sm:block"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="hidden rounded-lg bg-[#8B4A2B] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#723B22] sm:block"
            >
              Register
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="rounded-lg p-2 text-[#3E2A1E] hover:bg-[#EAD9C0] lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-3 flex flex-col gap-1 border-t border-[#E3D3BC] pt-3 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={linkClass(link.href)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 sm:hidden">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-[#E3D3BC] px-4 py-2 text-center font-semibold text-[#3E2A1E]"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg bg-[#8B4A2B] px-4 py-2 text-center font-semibold text-white"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}