"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserLoginForm() {
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
      router.push("/");
      router.refresh();
      return;
    }

    setError("Invalid email or password.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required placeholder="Email" />
      <input name="password" type="password" required placeholder="Password" />
      <button type="submit">Sign in</button>
      {error ? <p>{error}</p> : null}
    </form>
  );
}