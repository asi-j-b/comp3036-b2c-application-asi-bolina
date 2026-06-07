"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State hooks for text input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Interactive touch metrics to track blur events
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 1. STRICT REGEX PATTERN MATCHING YOUR REGISTRATION PAGE
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(email);

  // 2. DUAL-LAYER ERROR CONDITION CHECKING (Checks for empty vs malformed format)
  const isEmailEmpty = email.trim().length === 0;
  const showEmailFormatError = touched.email && !isEmailEmpty && !isEmailValid;
  const showEmailEmptyError = touched.email && isEmailEmpty;
  
  const passwordError = touched.password && password.trim().length === 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // Intercept submit button if fields are blank or regex checks fail
    if (email.trim().length === 0 || !isEmailValid || password.trim().length === 0) {
      setTouched({ email: true, password: true });
      return;
    }

    setIsSubmitting(true);
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
        setIsSubmitting(false);
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
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        
        {/* EMAIL INPUT FIELD WITH DUAL INLINE REGEX EXTRACTIONS */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            className={`w-full rounded-xl border p-3 text-sm outline-none focus:ring-2 ${
              showEmailEmptyError || showEmailFormatError ? "border-red-500 focus:ring-red-500 bg-white" : "border-[var(--ring)] focus:ring-wsu"
            }`}
          />
          {/* Renders if left completely empty */}
          {showEmailEmptyError && (
            <p className="text-xs text-red-500 font-medium">Please enter your email address.</p>
          )}
          {/* Renders if characters are typed but break the standard pattern layout */}
          {showEmailFormatError && (
            <p className="text-xs text-red-500 font-medium">Invalid email address. Please enter a valid email.</p>
          )}
        </div>

        {/* PASSWORD INPUT FIELD */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative">
            <input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`w-full rounded-xl border p-3 pr-12 text-sm outline-none focus:ring-2 ${
                passwordError ? "border-red-500 focus:ring-red-500 bg-white" : "border-[var(--ring)] focus:ring-wsu"
              }`} 
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
          {passwordError && (
            <p className="text-xs text-red-500 font-medium">Please enter your password.</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full rounded-full bg-wsu py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
      
      <div className="my-4 border-t border-[var(--ring)]">
        {error && <p className="mt-4 text-center text-sm text-red-500 font-medium">{error}</p>}
      </div>
      <div className="text-center text-sm text-primary">
        New to FSD? <a href="/register" className="font-medium text-wsu hover:underline">Create account</a>
      </div>
    </div>
  );
}