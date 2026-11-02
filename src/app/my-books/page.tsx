'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
};

const CATEGORIES = ['Fiction', 'Science', 'History', 'Kids', 'Others'];

const inputClass =
    'w-full rounded-lg border border-[#E3D3BC] bg-[#FFFBF2] px-4 py-2.5 text-[#3E2A1E] outline-none focus:border-[#8B4A2B]';
const labelClass = 'mb-1 block text-sm font-semibold text-[#3E2A1E]';

const Spinner = () => (
    <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E3D3BC] border-t-[#8B4A2B]" />
    </div>
);

export default function MyBooksPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState<Book | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState<Book | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (!isPending && !session) router.replace('/login?redirect=/my-books');
    }, [isPending, session, router]);

    const email = session?.user?.email;

    const loadBooks = useCallback(async () => {
        if (!email) return;
        try {
            const data = await apiFetch<Book[]>(`/books?email=${encodeURIComponent(email)}&sort=latest`, {
                auth: true,
                cache: 'no-store',
            });
            setBooks(data);
        } catch (error: any) {
            toast.error(error.message || 'Could not load your books');
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    const uploadImage = async (file: File): Promise<string> => {
        const body = new FormData();
        body.append('image', file);
        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
            { method: 'POST', body }
        );
        const data = await res.json();
        if (!res.ok || !data?.data?.url) throw new Error('Image upload failed');
        return data.data.url as string;
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editing) return;
        const formData = new FormData(e.currentTarget);
        const file = formData.get('image') as File;

        if (file && file.size > 5 * 1024 * 1024) {
            toast.error('Image must be smaller than 5MB');
            return;
        }

        setSaving(true);
        try {
            const image = file && file.size > 0 ? await uploadImage(file) : editing.image;

            await apiFetch(`/books/${editing._id}`, {
                method: 'PATCH',
                auth: true,
                body: JSON.stringify({
                    title: String(formData.get('title')),
                    author: String(formData.get('author')),
                    category: String(formData.get('category')),
                    description: String(formData.get('description')),
                    totalCopies: Number(formData.get('totalCopies')),
                    image,
                }),
            });

            toast.success('Book updated successfully!');
            setEditing(null);
            await loadBooks();
        } catch (error: any) {
            toast.error(error.message || 'Could not update the book');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleting) return;
        setDeleteLoading(true);
        try {
            await apiFetch(`/books/${deleting._id}`, { method: 'DELETE', auth: true });
            setBooks((prev) => prev.filter((b) => b._id !== deleting._id));
            toast.success('Book deleted successfully!');
            setDeleting(null);
        } catch (error: any) {
            toast.error(error.message || 'Could not delete the book');
            setDeleting(null);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (isPending || !session || loading) return <Spinner />;

    return (
        <div className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-center text-3xl font-bold text-[#3E2A1E]">My Books</h1>
            <p className="mt-2 text-center text-[#5C4433]">Books you have added to BookNook</p>

            {books.length === 0 ? (
                <div className="mt-10 rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] p-10 text-center">
                    <p className="text-[#5C4433]">You have not added any books yet.</p>
                    <Link
                        href="/add-book"
                        className="mt-4 inline-block rounded-lg bg-[#8B4A2B] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#723B22]"
                    >
                        Add Your First Book
                    </Link>
                </div>
            ) : (
                <div className="mt-10 overflow-x-auto rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] shadow-sm">
                    <table className="w-full min-w-175 text-left text-sm">
                        <thead className="bg-[#F5EBDD] text-[#3E2A1E]">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Image</th>
                                <th className="px-4 py-3 font-semibold">Title</th>
                                <th className="px-4 py-3 font-semibold">Author</th>
                                <th className="px-4 py-3 font-semibold">Category</th>
                                <th className="px-4 py-3 font-semibold">Copies</th>
                                <th className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book._id} className="border-t border-[#E3D3BC] text-[#5C4433]">
                                    <td className="px-4 py-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            className="h-16 w-12 rounded-md object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-[#3E2A1E]">{book.title}</td>
                                    <td className="px-4 py-3">{book.author}</td>
                                    <td className="px-4 py-3">{book.category}</td>
                                    <td className="px-4 py-3">
                                        {book.availableCopies} / {book.totalCopies}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditing(book)}
                                                className="rounded-lg bg-[#8B4A2B] px-3 py-1.5 font-semibold text-white transition-colors hover:bg-[#723B22]"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleting(book)}
                                                className="rounded-lg border border-red-600 px-3 py-1.5 font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit modal */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
                    <div className="w-full max-w-lg rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-[#3E2A1E]">Edit Book</h3>
                        <p className="mt-1 text-sm text-[#5C4433]">Update the details and save.</p>

                        <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                            <div>
                                <label className={labelClass}>Book Title</label>
                                <input name="title" type="text" required defaultValue={editing.title} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Author Name</label>
                                <input name="author" type="text" required defaultValue={editing.author} className={inputClass} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Category</label>
                                    <select name="category" required defaultValue={editing.category} className={inputClass}>
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Total Copies</label>
                                    <input
                                        name="totalCopies"
                                        type="number"
                                        min={1}
                                        step={1}
                                        required
                                        defaultValue={editing.totalCopies}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Book Image (optional)</label>
                                <div className="mb-2 flex items-center gap-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={editing.image}
                                        alt="Current cover"
                                        className="h-20 w-14 rounded-md border border-[#E3D3BC] object-cover"
                                    />
                                    <span className="text-xs text-[#5C4433]">
                                        Current image. Notun image select na korle eta-i thakbe.
                                    </span>
                                </div>
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-[#8B4A2B] file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white`}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Short Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    defaultValue={editing.description}
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    disabled={saving}
                                    className="rounded-lg border border-[#8B4A2B] px-4 py-2 font-semibold text-[#8B4A2B] hover:bg-[#8B4A2B]/10 disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-[#8B4A2B] px-4 py-2 font-semibold text-white hover:bg-[#723B22] disabled:opacity-60"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirm modal */}
            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-[#3E2A1E]">Delete this book?</h3>
                        <p className="mt-2 text-sm text-[#5C4433]">
                            <span className="font-semibold text-[#3E2A1E]">{deleting.title}</span> will be removed
                            permanently. This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleting(null)}
                                disabled={deleteLoading}
                                className="rounded-lg border border-[#8B4A2B] px-4 py-2 font-semibold text-[#8B4A2B] hover:bg-[#8B4A2B]/10 disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}