'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signUp, signOut } from '@/lib/auth-client';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (password: string) => {
        if (password.length < 6) return 'Password must be at least 6 characters';
        if (!/[A-Z]/.test(password)) return 'Password must have an uppercase letter';
        if (!/[a-z]/.test(password)) return 'Password must have a lowercase letter';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = String(formData.get('name'));
        const email = String(formData.get('email'));
        const image = String(formData.get('image'));
        const password = String(formData.get('password'));

        const error = validatePassword(password);
        setPasswordError(error);
        if (error) {
            toast.error(error);
            return;
        }

        setLoading(true);
        try {
            const { error: signUpError } = await signUp.email({
                name,
                email,
                password,
                image,
            });

            if (signUpError) {
                toast.error(signUpError.message || 'Registration failed');
                setLoading(false);
                return;
            }

            await signOut();
            toast.success('Registration successful! Please login.');

            setTimeout(() => {
                window.location.href = '/login';
            }, 1200);
        } catch {
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    const inputClass =
        'w-full rounded-lg border border-[#E3D3BC] bg-[#FFFBF2] px-4 py-2.5 text-[#3E2A1E] outline-none focus:border-[#8B4A2B]';

    return (
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
            <div className="w-full rounded-xl border border-[#E3D3BC] bg-[#F5EBDD] p-8 shadow-sm">
                <h1 className="text-center text-3xl font-bold text-[#3E2A1E]">Create Account</h1>
                <p className="mt-1 text-center text-sm text-[#5C4433]">Join BookNook today</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-[#3E2A1E]">Name</label>
                        <input name="name" type="text" required placeholder="Your name" className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-[#3E2A1E]">Email</label>
                        <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-[#3E2A1E]">Photo URL</label>
                        <input name="image" type="url" required placeholder="https://..." className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-[#3E2A1E]">Password</label>
                        <input name="password" type="password" required placeholder="Password" className={inputClass} />
                        {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[#8B4A2B] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#723B22] disabled:opacity-60"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#5C4433]">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-[#8B4A2B] hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}