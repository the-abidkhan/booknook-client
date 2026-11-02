'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';

type Borrow = {
    _id: string;
    bookId: string;
    bookTitle: string;
    bookImage: string;
    borrowDate: string;
    returnDate: string;
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

const Spinner = () => (
    <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E3D3BC] border-t-[#8B4A2B]" />
    </div>
);

export default function MyBorrowsPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [borrows, setBorrows] = useState<Borrow[]>([]);
    const [loading, setLoading] = useState(true);
    const [returning, setReturning] = useState<Borrow | null>(null);
    const [returnLoading, setReturnLoading] = useState(false);

    useEffect(() => {
        if (!isPending && !session) router.replace('/login?redirect=/my-borrows');
    }, [isPending, session, router]);

    const loadBorrows = useCallback(async () => {
        try {
            const data = await apiFetch<Borrow[]>('/borrows', { auth: true, cache: 'no-store' });
            setBorrows(data);
        } catch (error: any) {
            toast.error(error.message || 'Could not load your borrows');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (session) loadBorrows();
    }, [session, loadBorrows]);

    const handleReturn = async () => {
        if (!returning) return;
        setReturnLoading(true);
        try {
            await apiFetch(`/borrows/${returning._id}`, { method: 'DELETE', auth: true });
            setBorrows((prev) => prev.filter((b) => b._id !== returning._id));
            toast.success('Book returned successfully!');
            setReturning(null);
        } catch (error: any) {
            toast.error(error.message || 'Could not return the book');
            setReturning(null);
        } finally {
            setReturnLoading(false);
        }
    };

    if (isPending || !session || loading) return <Spinner />;

    return (
        <div className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-center text-3xl font-bold text-[#3E2A1E]">My Borrows</h1>
            <p className="mt-2 text-center text-[#5C4433]">Books you have borrowed from BookNook</p>

            {borrows.length === 0 ? (
                <div className="mt-10 rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] p-10 text-center">
                    <p className="text-[#5C4433]">You have not borrowed any books yet.</p>
                    <Link
                        href="/books"
                        className="mt-4 inline-block rounded-lg bg-[#8B4A2B] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#723B22]"
                    >
                        Browse Books
                    </Link>
                </div>
            ) : (
                <div className="mt-10 overflow-x-auto rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] shadow-sm">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="bg-[#F5EBDD] text-[#3E2A1E]">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Image</th>
                                <th className="px-4 py-3 font-semibold">Title</th>
                                <th className="px-4 py-3 font-semibold">Borrow Date</th>
                                <th className="px-4 py-3 font-semibold">Return Date</th>
                                <th className="px-4 py-3 text-right font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map((b) => (
                                <tr key={b._id} className="border-t border-[#E3D3BC] text-[#5C4433]">
                                    <td className="px-4 py-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={b.bookImage}
                                            alt={b.bookTitle}
                                            className="h-16 w-12 rounded-md object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-[#3E2A1E]">{b.bookTitle}</td>
                                    <td className="px-4 py-3">{formatDate(b.borrowDate)}</td>
                                    <td className="px-4 py-3">{formatDate(b.returnDate)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => setReturning(b)}
                                            className="rounded-lg bg-[#8B4A2B] px-3 py-1.5 font-semibold text-white transition-colors hover:bg-[#723B22]"
                                        >
                                            Return Book
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Return confirm modal */}
            {returning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-[#3E2A1E]">Return this book?</h3>
                        <p className="mt-2 text-sm text-[#5C4433]">
                            <span className="font-semibold text-[#3E2A1E]">{returning.bookTitle}</span> will be
                            returned to the library and become available for others.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setReturning(null)}
                                disabled={returnLoading}
                                className="rounded-lg border border-[#8B4A2B] px-4 py-2 font-semibold text-[#8B4A2B] hover:bg-[#8B4A2B]/10 disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReturn}
                                disabled={returnLoading}
                                className="rounded-lg bg-[#8B4A2B] px-4 py-2 font-semibold text-white hover:bg-[#723B22] disabled:opacity-60"
                            >
                                {returnLoading ? 'Returning...' : 'Yes, Return'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}