'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState('');

    async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get('password');
        
        const response = await fetch('/api/auth', {
            method: 'POST',
            body: JSON.stringify({ password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            router.refresh();
        } else {
            setError('Invalid password. Try again!');
        }
    };

    return (
        <div className="flex min-h-[50vh] items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Sign in to your account
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            placeholder="Enter admin password"
                            className="rounded-md border border-gray-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Sign In
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-center text-sm font-medium text-red-600">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}