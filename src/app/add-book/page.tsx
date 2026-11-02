'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';

const CATEGORIES = ['Fiction', 'Science', 'History', 'Kids', 'Others'];

export default function AddBookPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (!isPending && !session) router.replace('/login?redirect=/add-book');
    }, [isPending, session, router]);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const file = formData.get('image') as File;

        if (!file || file.size === 0) {
            toast.error('Please select a book image');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be smaller than 5MB');
            return;
        }

        setLoading(true);
        try {
            const imageUrl = await uploadImage(file);

            await apiFetch('/books', {
                method: 'POST',
                auth: true,
                body: JSON.stringify({
                    title: String(formData.get('title')),
                    author: String(formData.get('author')),
                    category: String(formData.get('category')),
                    image: imageUrl,
                    description: String(formData.get('description')),
                    totalCopies: Number(formData.get('totalCopies')),
                }),
            });

            toast.success('Book added successfully!');
            form.reset();
            setPreview('');
            router.push('/my-books');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full rounded-lg border border-[#E3D3BC] bg-[#FFFBF2] px-4 py-2.5 text-[#3E2A1E] outline-none focus:border-[#8B4A2B]';
    const readOnlyClass =
        'w-full cursor-not-allowed rounded-lg border border-[#E3D3BC] bg-[#F5EBDD] px-4 py-2.5 text-[#3E2A1E] outline-none';
    const labelClass = 'mb-1 block text-sm font-semibold text-[#3E2A1E]';

    if (isPending || !session) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E3D3BC] border-t-[#8B4A2B]" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-12">
            <div className="rounded-xl border border-[#E3D3BC] bg-[#F5EBDD] p-8 shadow-sm">
                <h1 className="text-center text-3xl font-bold text-[#3E2A1E]">Add a New Book</h1>
                <p className="mt-1 text-center text-sm text-[#5C4433]">
                    Share a book with the BookNook community
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className={labelClass}>Book Title</label>
                        <input name="title" type="text" required placeholder="Book title" className={inputClass} />
                    </div>

                    <div>
                        <label className={labelClass}>Author Name</label>
                        <input name="author" type="text" required placeholder="Author name" className={inputClass} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Category</label>
                            <select name="category" required defaultValue="" className={inputClass}>
                                <option value="" disabled>
                                    Select a category
                                </option>
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
                                defaultValue={1}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Book Image</label>
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                setPreview(f ? URL.createObjectURL(f) : '');
                            }}
                            className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-[#8B4A2B] file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white`}
                        />
                        {preview && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={preview}
                                alt="Selected book preview"
                                className="mt-3 h-40 w-32 rounded-lg border border-[#E3D3BC] object-cover"
                            />
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Short Description</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            placeholder="What is this book about?"
                            className={inputClass}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>User Name</label>
                            <input type="text" readOnly value={session.user.name} className={readOnlyClass} />
                        </div>
                        <div>
                            <label className={labelClass}>User Email</label>
                            <input type="email" readOnly value={session.user.email} className={readOnlyClass} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[#8B4A2B] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#723B22] disabled:opacity-60"
                    >
                        {loading ? 'Adding book...' : 'Add Book'}
                    </button>
                </form>
            </div>
        </div>
    );
}