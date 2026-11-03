'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
    userName: string;
    userEmail: string;
};

const Spinner = () => (
    <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E3D3BC] border-t-[#8B4A2B]" />
    </div>
);

export default function BookDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [borrowLoading, setBorrowLoading] = useState(false);
    const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);

    useEffect(() => {
        if (!isPending && !session) router.replace(`/login?redirect=/books/${id}`);
    }, [isPending, session, id, router]);

    useEffect(() => {
        if (!session || !id) return;

        async function loadData() {
            try {
                const data = await apiFetch<Book>(`/books/${id}`, { auth: true, cache: 'no-store' });
                setBook(data);
            } catch (error: any) {
                toast.error(error.message || 'Could not load book details', {
                    id: 'book-details-error',
                });
            } finally {
                setLoading(false);
            }

            try {
                const list = await apiFetch<{ bookId: string }[]>('/borrows', {
                    auth: true,
                    cache: 'no-store',
                });
                setAlreadyBorrowed(list.some((b) => b.bookId === id));
            } catch {
                setAlreadyBorrowed(false);
            }
        }

        loadData();
    }, [session, id]);

    const handleBorrowClick = () => {
        if (alreadyBorrowed) {
            toast.error('You have already borrowed this book');
            return;
        }
        if (book && book.availableCopies <= 0) {
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
            await apiFetch('/borrows', {
                method: 'POST',
                auth: true,
                body: JSON.stringify({ bookId: book._id }),
            });

            toast.success('Book borrowed successfully!');
            setAlreadyBorrowed(true);
            setIsModalOpen(false);
            router.push('/my-borrows');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setBorrowLoading(false);
        }
    };

    if (isPending || !session || loading) return <Spinner />;

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
                            <p><strong>Available Copies:</strong> {book.availableCopies} / {book.totalCopies}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleBorrowClick}
                            disabled={book.availableCopies <= 0 || alreadyBorrowed}
                            className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition-colors ${
                                book.availableCopies > 0 && !alreadyBorrowed
                                    ? 'bg-[#8B4A2B] hover:bg-[#723B22]'
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {alreadyBorrowed
                                ? 'Already Borrowed'
                                : book.availableCopies > 0
                                  ? 'Borrow This Book'
                                  : 'Not Available'}
                        </button>
                    </div>
                </div>
            </div>

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
                                    value={session.user.name || ''}
                                    className="w-full rounded-lg border border-[#E3D3BC] bg-[#F5EBDD] px-4 py-2 text-[#3E2A1E] outline-none cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-[#3E2A1E]">User Email</label>
                                <input
                                    type="email"
                                    readOnly
                                    value={session.user.email || ''}
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
                                    disabled={borrowLoading || alreadyBorrowed}
                                    className="rounded-lg bg-[#8B4A2B] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#723B22] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#8B4A2B]"
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