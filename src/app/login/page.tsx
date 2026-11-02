'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from '@/lib/auth-client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    setLoading(true);
    const { error } = await signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Invalid email or password');
      return;
    }

    toast.success('Login successful!');
    router.push(redirectTo);
    router.refresh();
  };

  const handleGoogle = () => {
    toast('Google login will be added soon');
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
              <Link href="/forgot-password" className="text-sm font-semibold text-[#8B4A2B] hover:underline">
                Forget Password?
              </Link>
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
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E3D3BC] bg-[#FFFBF2] px-4 py-2.5 font-semibold text-[#3E2A1E] transition-colors hover:bg-[#EAD9C0]"
        >
          Continue with Google
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