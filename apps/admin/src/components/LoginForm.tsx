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
        <div>
            <h2>Sign in to your account</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Password
                    <input type="password" name="password" />
                </label>
                <button type="submit">Sign In</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}