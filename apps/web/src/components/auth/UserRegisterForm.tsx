"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema } from "@/utils/registration";
// 1. IMPORT THE HEROICONS TO MATCH YOUR LOGIN FORM
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export function UserRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State tracking for field inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility toggle controls
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // "Touched" state tracking to avoid showing errors on a completely fresh, empty form
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation Rules
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(email);

  const hasNumber = /\d/.test(password);
  const hasSymbol = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
  const isLongEnough = password.length >= 8 && password.length <= 60;
  const metRequirementsCount = [hasNumber, hasSymbol, isLongEnough].filter(Boolean).length;

  // Individual Error Condition Calculations
  const firstNameError = (touched.firstName || firstName.length > 0) && (firstName.trim().length < 1 || firstName.length > 60);
  const lastNameError = (touched.lastName || lastName.length > 0) && (lastName.trim().length < 1 || lastName.length > 60);
  
  // FIXED DUAL-LAYER EMAIL ERROR LOGIC MATCHING THE LOGIN FORM
  const isEmailEmpty = email.trim().length === 0;
  const showEmailEmptyError = touched.email && isEmailEmpty;
  const showEmailFormatError = touched.email && !isEmailEmpty && !isEmailValid;

  const passwordError = (touched.password || password.length > 0) && metRequirementsCount < 3;
  const confirmPasswordError = (touched.confirmPassword || confirmPassword.length > 0) && password !== confirmPassword;

  // Global submission verification flag
  const isFormValid =
    firstName.trim().length >= 1 &&
    firstName.length <= 60 &&
    lastName.trim().length >= 1 &&
    lastName.length <= 60 &&
    isEmailValid &&
    metRequirementsCount === 3 &&
    password === confirmPassword;

  const getProgressBarColor = () => {
    if (password.length === 0) return "bg-neutral-200";
    if (metRequirementsCount === 3) return "bg-green-500";
    if (metRequirementsCount === 1 || metRequirementsCount === 2) return "bg-orange-500";
    return "bg-red-500";
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Please ensure all fields are corrected first.");
      return;
    }

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
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        
        {/* SIDE-BY-SIDE NAME INPUTS WITH FIELD ERRORS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <input 
              id="firstName" 
              name="firstName" 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => handleBlur("firstName")}
              className={`w-full rounded-xl border p-3 text-sm outline-none focus:ring-2 bg-white ${
                firstNameError ? "border-red-500 focus:ring-red-500" : "border-[var(--ring)] focus:ring-wsu"
              }`} 
            />
            {firstNameError && (
              <p className="text-xs text-red-500 font-medium">Please enter your first name.</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <input 
              id="lastName" 
              name="lastName" 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => handleBlur("lastName")}
              className={`w-full rounded-xl border p-3 text-sm outline-none focus:ring-2 bg-white ${
                lastNameError ? "border-red-500 focus:ring-red-500" : "border-[var(--ring)] focus:ring-wsu"
              }`} 
            />
            {lastNameError && (
              <p className="text-xs text-red-500 font-medium">Please enter your last name.</p>
            )}
          </div>
        </div>

        {/* EMAIL ADDRESS WITH CONDITIONAL DUAL-LAYER ERRORS */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            className={`w-full rounded-xl border p-3 text-sm outline-none focus:ring-2 bg-white ${
              showEmailEmptyError || showEmailFormatError ? "border-red-500 focus:ring-red-500" : "border-[var(--ring)] focus:ring-wsu"
            }`}
          />
          {showEmailEmptyError && (
            <p className="text-xs text-red-500 font-medium">Please enter your email address.</p>
          )}
          {showEmailFormatError && (
            <p className="text-xs text-red-500 font-medium">Invalid email address. Please enter a valid email.</p>
          )}
        </div>

        {/* PASSWORD INPUT WITH NEW EYE ICONS */}
        <div className="space-y-2 relative">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative">
            <input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`w-full rounded-xl border p-3 pr-12 text-sm outline-none focus:ring-2 bg-white ${
                passwordError ? "border-red-500 focus:ring-red-500" : "border-[var(--ring)] focus:ring-wsu"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-primary transition hover:text-wsu"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-xs text-red-500 font-medium">Please enter a password.</p>
          )}
        </div>

        {/* STRENGTH INDICATOR PROGRESS BAR */}
        <div className="w-full h-2 bg-neutral-200 rounded overflow-hidden -mt-1">
          <div
            className={`h-full transition-all duration-300 ${getProgressBarColor()}`}
            style={{
              width: password.length === 0 ? "0%" : metRequirementsCount === 3 ? "100%" : metRequirementsCount === 2 ? "66%" : "33%",
            }}
          />
        </div>

        {/* PASSWORD REQUIREMENT MATRIX */}
        <div className="text-xs space-y-1 p-3 bg-neutral-50 border rounded-xl text-neutral-600">
          <div className="flex items-center gap-2">
            <span className={isLongEnough ? "text-green-600 font-bold" : "text-neutral-300"}>✓</span>
            <span className={isLongEnough ? "text-green-600 font-medium" : "text-neutral-500"}>At least 8 characters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasNumber ? "text-green-600 font-bold" : "text-neutral-300"}>✓</span>
            <span className={hasNumber ? "text-green-600 font-medium" : "text-neutral-500"}>Contains at least 1 number</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasSymbol ? "text-green-600 font-bold" : "text-neutral-300"}>✓</span>
            <span className={hasSymbol ? "text-green-600 font-medium" : "text-neutral-500"}>Contains at least 1 special character</span>
          </div>
        </div>

        {/* CONFIRM PASSWORD INPUT WITH EYE ICONS */}
        <div className="space-y-2 relative">
          <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</label>
          <div className="relative">
            <input 
              id="confirmPassword" 
              name="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              className={`w-full rounded-xl border p-3 pr-12 text-sm outline-none focus:ring-2 bg-white ${
                confirmPasswordError ? "border-red-500 focus:ring-red-500" : "border-[var(--ring)] focus:ring-wsu"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-primary transition hover:text-wsu"
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="text-xs text-red-500 font-medium">Passwords do not match.</p>
          )}
        </div>

        <div className="text-center text-sm text-primary">
          Already have an account? <Link href="/login" className="font-medium text-wsu hover:underline">Sign in</Link>
        </div>

        {/* SUBMIT BUTTON WITH CURSOR LOCKS */}
        <button 
          type="submit" 
          disabled={!isFormValid || isSubmitting} 
          className={`w-full rounded-full py-3 font-semibold text-white transition-all duration-200 ${
            isFormValid && !isSubmitting
              ? "bg-wsu hover:brightness-110 cursor-pointer shadow-md"
              : "bg-neutral-300 text-neutral-500 cursor-not-allowed opacity-100"
          }`}
          style={{ cursor: isFormValid && !isSubmitting ? "pointer" : "not-allowed" }}
        >
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>
      
      {error && <p className="mt-4 text-center text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}