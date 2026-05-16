'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Added an interface to define what props this component accepts
interface LoginFormProps {
  actionUrl: string;
  isAdmin?: boolean;
}

export function LoginForm({ actionUrl, isAdmin = false }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // Uses the dynamic actionUrl prop instead of hardcoded '/api/auth'
    const response = await fetch(actionUrl, {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // Logic for cross-port redirection if necessary
      if (isAdmin) {
        // Hard redirect to Admin Dashboard on port 3002
        window.location.assign('/dashboard');
      } else {
        router.push('/');
        router.refresh();
      }
    } else {
      setError(isAdmin ? 'Unauthorized access denied.' : 'Invalid email or password.');
    }
  }

  return (
    <div className={`mx-auto w-full max-w-md p-10 shadow-lg border ${
      isAdmin ? 'rounded-lg border-slate-700 bg-slate-900 text-white' : 'rounded-[2rem] border-[var(--ring)] bg-[var(--surface)] text-primary'
    }`}>
      <div className="mb-8 text-center">
        {/* Dynamic content based on isAdmin prop */}
        <h1 className="text-3xl font-bold">
          {isAdmin ? 'Staff Portal' : 'Welcome Back'}
        </h1>
        <p className={`mt-2 text-sm ${isAdmin ? 'text-slate-400' : 'text-secondary'}`}>
          {isAdmin ? 'Authorized personnel only.' : 'Please enter your details to shop.'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <input 
            name="email" 
            type="email" 
            required 
            className={`w-full p-3 text-sm outline-none focus:ring-2 ${
              isAdmin ? 'bg-transparent border-b border-slate-600 focus:border-white' : 'rounded-xl border border-[var(--ring)] focus:ring-wsu'
            }`} 
            placeholder={isAdmin ? 'staff@wsustore.com' : 'alice@example.com'} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input 
            name="password" 
            type="password" 
            required 
            className={`w-full p-3 text-sm outline-none focus:ring-2 ${
              isAdmin ? 'bg-transparent border-b border-slate-600 focus:border-white' : 'rounded-xl border border-[var(--ring)] focus:ring-wsu'
            }`}
          />
        </div>
        <button 
          type="submit" 
          className={`w-full py-3 font-semibold transition ${
            isAdmin ? 'bg-white text-slate-900 hover:bg-slate-200' : 'rounded-full bg-wsu text-white hover:brightness-110'
          }`}
        >
          {isAdmin ? 'Authenticate' : 'Sign In'}
        </button>
      </form>
      {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
    </div>
  );
}