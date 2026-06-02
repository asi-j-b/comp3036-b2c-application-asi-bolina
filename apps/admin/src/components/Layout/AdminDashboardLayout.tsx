import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "../auth/LogoutButton";

export function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin-dashboard" className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-slate-950">
            Staff Portal
          </Link>

          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link href="/admin-dashboard/inventory" className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950">
              Inventory
            </Link>
            <Link href="/admin-dashboard/manage-products" className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950">
              Products
            </Link>
            <Link href="/admin-dashboard/purchase-records" className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950">
              Purchases
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
