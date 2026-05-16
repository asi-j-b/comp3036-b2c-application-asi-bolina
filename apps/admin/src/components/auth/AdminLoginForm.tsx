"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setError("Unauthorized access denied.");
  }

    return (
        <div className="mx-auto w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-8 text-white shadow-2xl">
            <div className="mb-8 border-b border-slate-700 pb-4">
                <h2 className="text-xl font-mono tracking-widest uppercase">Staff Portal</h2>
                <p className="mt-1 text-xs text-slate-400">Authorized personnel only.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-400">Email</label>
                  <input name="email" type="email" required className="w-full border-b border-slate-600 bg-transparent py-2 text-sm outline-none focus:border-white"/>
                  <label className="text-xs font-semibold uppercase text-slate-400">Password</label>
                  <input name="password" type="password" required className="w-full border-b border-slate-600 bg-transparent py-2 text-sm outline-none focus:border-white"/>
                </div>
                <button type="submit" className="w-full bg-white py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-200">
                  Authenticate
                </button>
            </form>
            {error && <p className="mt-4 text-center text-xs font-mono text-red-400">{error}</p>}
        </div>
    );
}