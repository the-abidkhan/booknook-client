'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (!isPending && !session) router.replace('/login?redirect=/profile');
    }, [isPending, session, router]);

    if (isPending || !session) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E3D3BC] border-t-[#8B4A2B]" />
            </div>
        );
    }

    const { name, email, image } = session.user;

    return (
        <div className="mx-auto max-w-md px-4 py-12">
            <div className="rounded-xl border border-[#E3D3BC] bg-[#F5EBDD] p-8 text-center shadow-sm">
                <h1 className="text-3xl font-bold text-[#3E2A1E]">My Profile</h1>

                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="mx-auto mt-6 h-28 w-28 rounded-full border-4 border-[#8B4A2B] object-cover"
                    />
                ) : (
                    <div className="mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#8B4A2B] bg-[#FFFBF2] text-4xl font-bold text-[#8B4A2B]">
                        {name?.charAt(0).toUpperCase()}
                    </div>
                )}

                <h2 className="mt-4 text-2xl font-bold text-[#3E2A1E]">{name}</h2>
                <p className="mt-1 text-[#5C4433]">{email}</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <Link
                        href="/my-books"
                        className="rounded-lg bg-[#8B4A2B] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#723B22]"
                    >
                        My Books
                    </Link>
                    <Link
                        href="/my-borrows"
                        className="rounded-lg border border-[#8B4A2B] px-4 py-2.5 font-semibold text-[#8B4A2B] transition-colors hover:bg-[#8B4A2B]/10"
                    >
                        My Borrows
                    </Link>
                </div>
            </div>
        </div>
    );
}