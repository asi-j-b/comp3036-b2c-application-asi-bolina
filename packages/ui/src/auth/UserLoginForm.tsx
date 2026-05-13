'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function UserLoginForm() {
    const router = useRouter();
    const [error, setError] = useState('');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const response = await fetch('/api/auth', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            router.push('/'); // Back to shopping
            router.refresh();
        } else {
            setError('Invalid email or password.');
        }
    }

    return (
        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-[var(--ring)] bg-[var(--surface)] p-10 shadow-lg">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
                <p className="mt-2 text-sm text-secondary">Please enter your details to shop.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input name="email" type="email" required className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu" placeholder="alice@example.com" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <input name="password" type="password" required className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu" />
                </div>
                <button type="submit" className="w-full rounded-full bg-wsu py-3 font-semibold text-white transition hover:brightness-110">
                    Sign In
                </button>
            </form>
            {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
        </div>
    );
}