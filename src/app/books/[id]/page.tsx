'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    copies: number;
    userName: string;
    userEmail: string;
};

export default function BookDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [borrowLoading, setBorrowLoading] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        async function fetchBookDetails() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);
                if (!res.ok) throw new Error('Failed to fetch book');
                const data = await res.json();
                setBook(data);
            } catch {
                toast.error('Could not load book details');
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchBookDetails();
        }
    }, [id]);

    const handleBorrowClick = () => {
        if (!session) {
            toast.error('Please login to borrow a book');
            router.push(`/login?redirect=/books/${id}`);
            return;
        }
        if (book && book.copies <= 0) {
            toast.error('This book is currently not available');
            return;
        }
        setIsModalOpen(true);
    };

    const handleConfirmBorrow = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session || !book) return;

        setBorrowLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookId: book._id,
                    bookTitle: book.title,
                    bookImage: book.image,
                    userEmail: session.user.email,
                    userName: session.user.name,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to borrow book');
            }

            toast.success('Book borrowed successfully!');
            setIsModalOpen(false);
            router.push('/my-borrows');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setBorrowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-semibold text-[#3E2A1E]">Loading book details...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-[#3E2A1E]">Book not found</h2>
                <button
                    onClick={() => router.push('/books')}
                    className="mt-4 rounded-lg bg-[#8B4A2B] px-4 py-2 font-semibold text-white hover:bg-[#723B22]"
                >
                    Back to All Books
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-12">
            <div className="grid gap-8 md:grid-cols-2 rounded-2xl border border-[#E3D3BC] bg-[#FFFBF2] p-8 shadow-sm">
                <div className="relative h-96 w-full overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <span className="rounded-full bg-[#8B4A2B]/10 px-3 py-1 text-xs font-semibold text-[#8B4A2B]">
                            {book.category}
                        </span>
                        <h1 className="mt-3 text-3xl font-bold text-[#3E2A1E]">{book.title}</h1>
                        <p className="mt-1 text-base text-[#5C4433]">by {book.author}</p>

                        <p className="mt-4 text-sm leading-relaxed text-[#5C4433]">{book.description}</p>

                        <div className="mt-6 border-t border-[#E3D3BC] pt-4 text-sm text-[#5C4433] space-y-1">
                            <p><strong>Added By:</strong> {book.userName} ({book.userEmail})</p>
                            <p><strong>Available Copies:</strong> {book.copies}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleBorrowClick}
                            disabled={book.copies <= 0}
                            className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition-colors ${book.copies > 0
                                    ? 'bg-[#8B4A2B] hover:bg-[#723B22]'
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {book.copies > 0 ? 'Borrow This Book' : 'Not Available'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Borrow Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-xl bg-[#FFFBF2] border border-[#E3D3BC] p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-[#3E2A1E]">Confirm Borrow</h3>
                        <p className="mt-1 text-sm text-[#5C4433]">Review your details before confirming.</p>

                        <form onSubmit={handleConfirmBorrow} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-[#3E2A1E]">User Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={session?.user?.name || ''}
                                    className="w-full rounded-lg border border-[#E3D3BC] bg-[#F5EBDD] px-4 py-2 text-[#3E2A1E] outline-none cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-[#3E2A1E]">User Email</label>
                                <input
                                    type="email"
                                    readOnly
                                    value={session?.user?.email || ''}
                                    className="w-full rounded-lg border border-[#E3D3BC] bg-[#F5EBDD] px-4 py-2 text-[#3E2A1E] outline-none cursor-not-allowed"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg border border-[#8B4A2B] px-4 py-2 font-semibold text-[#8B4A2B] hover:bg-[#8B4A2B]/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={borrowLoading}
                                    className="rounded-lg bg-[#8B4A2B] px-4 py-2 font-semibold text-white hover:bg-[#723B22] disabled:opacity-60"
                                >
                                    {borrowLoading ? 'Confirming...' : 'Confirm Borrow'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}