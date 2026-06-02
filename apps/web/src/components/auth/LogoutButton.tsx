"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({
  onLogout,
  className,
  label = "Logout",
}: {
  onLogout?: () => void;
  className?: string;
  label?: string;
}) {
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
      className={className ?? "rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"}
    >
      {label}
    </button>
  );
}