'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X, LogOut } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  const isLoggedIn = !!user;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Books', href: '/books' },
    ...(isLoggedIn ? [
      { name: 'Add Book', href: '/add-book' },
      { name: 'My Books', href: '/my-books' },
      { name: 'My Borrows', href: '/my-borrows' },
    ] : []),
  ];

  const linkClass = (href: string) =>
    `whitespace-nowrap rounded-lg px-4 py-2 font-semibold transition-colors ${
      pathname === href
        ? 'bg-[#8B4A2B] text-white'
        : 'text-[#3E2A1E] hover:bg-[#EAD9C0] hover:text-[#8B4A2B]'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E3D3BC] bg-[#F5EBDD]">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <BookOpen className="h-7 w-7 text-[#8B4A2B]" strokeWidth={2.2} />
            <span className="text-[#3E2A1E] font-josefin">BookNook</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={linkClass(link.href)}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 font-semibold text-[#3E2A1E] transition-colors hover:bg-[#EAD9C0]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-[#8B4A2B] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#723B22]"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-[#EAD9C0]"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user?.name || 'User'}
                      className="h-9 w-9 rounded-full object-cover border border-[#8B4A2B]"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B4A2B] font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="font-semibold text-[#3E2A1E]">{user?.name}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#E3D3BC] bg-[#F5EBDD] p-1 shadow-lg">
                    <button
                      onClick={async () => {
                        setShowProfileMenu(false);
                        await signOut();
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-semibold text-red-600 transition-colors hover:bg-[#EAD9C0]"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

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

            <div className="mt-2 border-t border-[#E3D3BC] pt-2 sm:hidden">
              {!isLoggedIn ? (
                <div className="flex gap-2">
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
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-2 py-1">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user?.name || 'User'}
                        className="h-8 w-8 rounded-full border border-[#8B4A2B]"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B4A2B] text-sm font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="font-semibold text-[#3E2A1E]">{user?.name}</span>
                  </div>
                  <button
                    onClick={async () => {
                      setOpen(false);
                      await signOut();
                    }}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}