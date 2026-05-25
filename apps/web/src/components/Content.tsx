import Link from "next/link";
import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--surface)]">
      <main className="w-full flex-1">{children}</main>
      <footer className="border-t border-[var(--ring)] bg-[var(--surface)] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 text-sm text-secondary">
          <Link href="/about-us" className="hover:text-wsu">
            About Us
          </Link>
          <Link href="/privacy-policy" className="hover:text-wsu">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
