'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { signIn, useSession } from '@/lib/auth-client';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rawRedirect = searchParams.get('redirect') || '/';
    const redirectTo =
        rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/';
    const { data: session } = useSession();

    useEffect(() => {
        if (session) router.replace(redirectTo);
    }, [session, redirectTo, router]);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = String(formData.get('email'));
        const password = String(formData.get('password'));

        setLoading(true);
        try {
            const { error } = await signIn.email({ email, password });
            if (error) {
                toast.error(error.message || 'Invalid email or password');
                return;
            }
            toast.success('Login successful!');
            router.push(redirectTo);
            router.refresh();
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await signIn.social({
                provider: 'google',
                callbackURL: redirectTo,
            });
            if (error) {
                toast.error(error.message || 'Google login failed');
                setGoogleLoading(false);
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
            setGoogleLoading(false);
        }
    };

    const inputClass =
        'w-full rounded-lg border border-[#E3D3BC] bg-[#FFFBF2] px-4 py-2.5 text-[#3E2A1E] outline-none focus:border-[#8B4A2B]';

    return (
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
            <div className="w-full rounded-xl border border-[#E3D3BC] bg-[#F5EBDD] p-8 shadow-sm">
                <h1 className="text-center text-3xl font-bold text-[#3E2A1E]">Welcome Back</h1>
                <p className="mt-1 text-center text-sm text-[#5C4433]">Login to your BookNook account</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-[#3E2A1E]">Email</label>
                        <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-[#3E2A1E]">Password</label>
                        <input name="password" type="password" required placeholder="Password" className={inputClass} />
                        <div className="mt-1 text-right">
                            <button
                                type="button"
                                onClick={() => toast('Password reset is not available yet')}
                                className="text-sm font-semibold text-[#8B4A2B] hover:underline"
                            >
                                Forget Password?
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[#8B4A2B] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#723B22] disabled:opacity-60"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#E3D3BC]" />
                    <span className="text-sm text-[#5C4433]">or</span>
                    <div className="h-px flex-1 bg-[#E3D3BC]" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={googleLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#E3D3BC] bg-[#FFFBF2] px-4 py-2.5 font-semibold text-[#3E2A1E] transition-colors hover:bg-[#EAD9C0] disabled:opacity-60"
                >
                    <FcGoogle className="h-5 w-5" />
                    {googleLoading ? 'Redirecting...' : 'Continue with Google'}
                </button>

                <p className="mt-6 text-center text-sm text-[#5C4433]">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-semibold text-[#8B4A2B] hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}