"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({ onLogout }: { onLogout?: () => void }) {
  const router = useRouter();

  async function handleLogout() {
    const response = await fetch("/api/auth", { method: "DELETE" });

    if (response.ok) {
      onLogout?.();
      router.push("/");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
    >
      Logout
    </button>
  );
}