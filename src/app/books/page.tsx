import { Suspense } from 'react';
import type { Metadata } from 'next';
import BooksExplorer from '@/components/BooksExplorer';

export const metadata: Metadata = { title: 'BookNook | All Books' };

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
    availableCopies?: number;
};

async function getBooks(): Promise<Book[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?sort=latest`, {
            cache: 'no-store',
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function AllBooksPage() {
    const books = await getBooks();

    return (
        <section className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-center text-3xl font-bold text-[#3E2A1E]">All Books</h1>
            <p className="mt-2 text-center text-[#5C4433]">Browse every book in our library</p>

            <Suspense fallback={null}>
                <BooksExplorer books={books} />
            </Suspense>
        </section>
    );
}