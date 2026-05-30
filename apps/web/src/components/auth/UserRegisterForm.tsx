"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
const lowercasePattern = /[a-z]/;
const uppercasePattern = /[A-Z]/;
const specialCharPattern = /[^A-Za-z0-9]/;

function RuleItem({ label, met }: { label: string; met: boolean }) {
  return (
    <li
      className={`flex items-center gap-2 text-xs transition-colors ${met ? "text-emerald-600" : "text-secondary"}`}
      aria-live="polite"
    >
      <span
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold ${
          met ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-[var(--ring)] bg-[var(--surface)] text-secondary"
        }`}
      >
        {met ? "✓" : "•"}
      </span>
      <span>{label}</span>
    </li>
  );
}

export function UserRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = useMemo(() => passwordPattern.test(password), [password]);
  const hasLowercase = useMemo(() => lowercasePattern.test(password), [password]);
  const hasUppercase = useMemo(() => uppercasePattern.test(password), [password]);
  const hasSpecialChar = useMemo(() => specialCharPattern.test(password), [password]);
  const hasMinLength = useMemo(() => password.length >= 8, [password]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData);

    if (!passwordPattern.test(String(payload.password ?? ""))) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and a special character.");
      return;
    }

    if (String(payload.password ?? "") !== String(payload.confirmPassword ?? "")) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
        return;
      }

      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(data?.message ?? "Unable to register. Please try again.");
    } catch {
      setError("Unable to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-[var(--ring)] bg-[var(--surface)] p-10 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Create Your Account</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-[var(--ring)] p-3 text-sm outline-none focus:ring-2 focus:ring-wsu"
            placeholder="alice@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[var(--ring)] p-3 pr-16 text-sm outline-none focus:ring-2 focus:ring-wsu"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-2 my-auto h-8 rounded-md px-2 text-xs font-medium text-secondary hover:bg-[var(--surface-muted)] hover:text-primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="rounded-lg border border-[var(--ring)] bg-[var(--surface-muted)]/50 px-3 py-2">
            <p className={`mb-2 text-xs font-medium ${isPasswordValid || !password ? "text-secondary" : "text-red-500"}`}>
              Password requirements
            </p>
            <ul className="space-y-1.5">
              <RuleItem label="At least 8 characters" met={hasMinLength} />
              <RuleItem label="At least 1 uppercase letter" met={hasUppercase} />
              <RuleItem label="At least 1 lowercase letter" met={hasLowercase} />
              <RuleItem label="At least 1 special character" met={hasSpecialChar} />
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              className="w-full rounded-xl border border-[var(--ring)] p-3 pr-16 text-sm outline-none focus:ring-2 focus:ring-wsu"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute inset-y-0 right-2 my-auto h-8 rounded-md px-2 text-xs font-medium text-secondary hover:bg-[var(--surface-muted)] hover:text-primary"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-primary">
          Already have an account? <Link href="/login" className="font-medium text-wsu hover:underline">Sign in</Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-wsu py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      {error ? <p className="mt-4 text-center text-sm text-red-500">{error}</p> : null}
    </div>
  );
}