"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      router.push("/admin-dashboard");
      router.refresh();
      return;
    }
    setError("Unauthorized access denied.");
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="mt-2 font-mono text-xl font-bold uppercase tracking-widest text-slate-950">
          Staff Portal
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Authorized personnel only.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-slate-400">Email</label>
          <input 
            id="admin-email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />
          <label className="text-xs font-semibold uppercase text-slate-400">Password</label>
          <div className="relative">
            <input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-11 text-sm text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-slate-900"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
        >
          Login
        </button>
      </form>
      {error && <p className="mt-4 text-center text-xs font-mono text-red-400">{error}</p>}
    </div>
  );
}
