import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return (
    <main className="w-full bg-[var(--surface)]">{children}</main>
  );
}
