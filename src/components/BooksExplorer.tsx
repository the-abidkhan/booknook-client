'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
    availableCopies?: number;
};

const CATEGORIES = ['Fiction', 'Science', 'History', 'Kids', 'Others'];

export default function BooksExplorer({ books }: { books: Book[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rawCategory = searchParams.get('category') || 'All';
    const active = CATEGORIES.includes(rawCategory) ? rawCategory : 'All';

    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<'newest' | 'title'>('newest');

    const counts = useMemo(() => {
        const map: Record<string, number> = { All: books.length };
        CATEGORIES.forEach((c) => (map[c] = books.filter((b) => b.category === c).length));
        return map;
    }, [books]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = books.filter(
            (b) =>
                (active === 'All' || b.category === active) &&
                (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
        );
        if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
        return list;
    }, [books, active, query, sort]);

    const selectCategory = (cat: string) => {
        router.replace(cat === 'All' ? '/books' : `/books?category=${cat}`, { scroll: false });
    };

    return (
        <>
            {/* Category tabs */}
            <div className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center">
                {['All', ...CATEGORIES].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => selectCategory(cat)}
                        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                            active === cat
                                ? 'border-[#8B4A2B] bg-[#8B4A2B] text-white'
                                : 'border-[#E3D3BC] bg-[#FFFBF2] text-[#3E2A1E] hover:border-[#8B4A2B]'
                        }`}
                    >
                        {cat} ({counts[cat]})
                    </button>
                ))}
            </div>

            {/* Search + sort */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title or author..."
                    className="w-full rounded-lg border border-[#E3D3BC] bg-[#FFFBF2] px-4 py-2.5 text-[#3E2A1E] outline-none focus:border-[#8B4A2B]"
                />
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as 'newest' | 'title')}
                    className="rounded-lg border border-[#E3D3BC] bg-[#FFFBF2] px-4 py-2.5 text-[#3E2A1E] outline-none focus:border-[#8B4A2B] sm:w-56"
                >
                    <option value="newest">Newest first</option>
                    <option value="title">Title (A-Z)</option>
                </select>
            </div>

            <p className="mt-6 text-sm text-[#5C4433]">
                Showing {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
                {active !== 'All' && ` in ${active}`}
            </p>

            {filtered.length === 0 ? (
                <p className="mt-10 text-center text-[#5C4433]">No books match your search.</p>
            ) : (
                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((book) => (
                        <div
                            key={book._id}
                            className="group flex flex-col overflow-hidden rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#8B4A2B] hover:shadow-xl"
                        >
                            <div className="relative h-72 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {book.availableCopies === 0 && (
                                    <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                                        Not Available
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <span className="w-fit rounded-full bg-[#8B4A2B]/10 px-3 py-1 text-xs font-semibold text-[#8B4A2B]">
                                    {book.category}
                                </span>
                                <h3 className="mt-3 text-lg font-bold text-[#3E2A1E]">{book.title}</h3>
                                <p className="mt-1 mb-4 text-sm text-[#5C4433]">by {book.author}</p>
                                <Link
                                    href={`/books/${book._id}`}
                                    className="mt-auto rounded-lg bg-[#8B4A2B] px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-[#723B22]"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}