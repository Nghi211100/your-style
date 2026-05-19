'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const loginUser = useUserStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      if (!res.ok) {
        throw new Error('Registration failed. Please check inputs and try again.');
      }

      const userData = await res.json();

      // Zustand log-in
      loginUser(
        {
          id: userData.id,
          email: userData.email,
          name: userData.name || 'Atelier Customer',
          role: userData.role || 'CUSTOMER',
        },
        'mock-jwt-auth-token-' + userData.id
      );

      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Atelier offline. Please ensure NestJS API is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-ivory min-h-screen text-[#1c1b1b] flex flex-col justify-center items-center px-6 pt-[140px] pb-24">
      <div className="max-w-[420px] w-full bg-white rounded-3xl p-8 md:p-10 border border-neutral-200/50 shadow-md">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <span className="text-[10px] text-champagne-gold uppercase tracking-[0.25em] font-semibold">
            CREATE ACCOUNT
          </span>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">
            Join the Atelier
          </h1>
          <p className="text-xs font-light text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
            Create an organic identity to unlock early access, editorial journals, and tailored details.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl mb-6 leading-relaxed">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider block">
              FULL NAME
            </label>
            <input
              type="text"
              required
              placeholder="Elena Rossi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-champagne-gold rounded-full px-5 py-3.5 text-xs text-neutral-950 outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider block">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-champagne-gold rounded-full px-5 py-3.5 text-xs text-neutral-950 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white rounded-full py-4 text-xs font-bold uppercase tracking-widest hover:bg-champagne-gold transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? 'CREATING IDENTITY...' : 'CREATE ATELIER ACCOUNT'}
          </button>
        </form>

        {/* Separator */}
        <div className="border-t border-neutral-200 my-6"></div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-500 font-light">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-champagne-gold font-semibold underline underline-offset-2 hover:text-neutral-900 transition-colors"
          >
            Sign In Instead
          </Link>
        </div>

      </div>
    </div>
  );
}
