"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // 1. ADDED IS_SUBMITTING STATE TRACKING FOR LOADING SESSIONS
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true); // 2. TRIGGER LOADING FEEDBACK STATS IMMEDIATELY

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
        return;
      } else {
        setError("Invalid email or password.");
        setIsSubmitting(false); // RELEASE STATE ONLY ON VALIDATION FAILS
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-[var(--ring)] bg-[var(--surface)] p-10 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">FSD</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative">
            <input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              className="w-full rounded-xl border border-[var(--ring)] p-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-wsu" 
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-primary transition hover:text-wsu"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* 3. DYNAMIC BUTTON TEXT & SUBMISSION DISABLER */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full rounded-full bg-wsu py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
      
      <div className="my-4 border-t border-[var(--ring)]">
        {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
      </div>
      <div className="text-center text-sm text-primary">
        New to FSD? <a href="/register" className="font-medium text-wsu hover:underline">Create account</a>
      </div>
    </div>
  );
}