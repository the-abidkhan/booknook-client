import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'BookNook | Page Not Found' };

export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
            <p className="text-7xl font-bold text-[#8B4A2B]">404</p>
            <h1 className="mt-4 text-3xl font-bold text-[#3E2A1E]">Page Not Found</h1>
            <p className="mt-2 text-[#5C4433]">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link
                href="/"
                className="mt-6 rounded-lg bg-[#8B4A2B] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#723B22]"
            >
                Back to Home
            </Link>
        </div>
    );
}