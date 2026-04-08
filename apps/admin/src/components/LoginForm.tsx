'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Username: <input name="username" type="text" required /></label>
      </div>
      <div>
        <label>Password: <input name="password" type="password" required /></label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
}