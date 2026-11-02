import Link from 'next/link';
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'All Books', href: '/books' },
  { name: 'Add Book', href: '/add-book' },
  { name: 'My Books', href: '/my-books' },
  { name: 'My Borrows', href: '/my-borrows' },
];

const socials = [
  { name: 'X', href: 'https://x.com', icon: <FaXTwitter className="h-4 w-4" /> },
  { name: 'Facebook', href: 'https://facebook.com', icon: <FaFacebookF className="h-4 w-4" /> },
  { name: 'Instagram', href: 'https://instagram.com', icon: <FaInstagram className="h-4 w-4" /> },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#8B4A2B]/20 bg-[#3E2A1E] text-[#F5EBDD]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <BookOpen className="h-7 w-7 text-[#E3D3BC]" strokeWidth={2.2} />
              <span className="text-white">BookNook</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-[#E3D3BC]">
              A small online library where you can add a book, borrow a book and return it with ease.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#E3D3BC] transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-[#E3D3BC]">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#8B4A2B]" /> Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#8B4A2B]" /> support@booknook.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#8B4A2B]" /> +880 1234-567890
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B4A2B] text-white transition-colors hover:bg-[#723B22]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#8B4A2B]/30 pt-5 text-center text-sm text-[#E3D3BC]">
          © {new Date().getFullYear()} BookNook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}