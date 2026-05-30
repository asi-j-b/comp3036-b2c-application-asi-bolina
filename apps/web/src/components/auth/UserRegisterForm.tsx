"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema } from "@/utils/registration";

export function UserRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData);
    const result = registerSchema.safeParse(payload);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check your registration details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(result.data),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
        return;
      }

      const data = await response.json().catch(() => null);
      setError(data?.message ?? "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-[var(--ring)] bg-[var(--surface)] p-10 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Create Account</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input id="name" name="name" type="text" maxLength={80} className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
          <input id="email" name="email" type="email" required maxLength={254} className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu" placeholder="alice@example.com" />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" required minLength={8} maxLength={128} className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu" />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} maxLength={128} className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu" />
        </div>
        <div className="text-center text-sm text-primary">
          Already have an account? <Link href="/login" className="font-medium text-wsu hover:underline">Sign in</Link>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-wsu py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </form>
      {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
    </div>
  );
}
