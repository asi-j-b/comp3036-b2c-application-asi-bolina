import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return (
    <div className="w-full border-l border-gray-200 bg-[var(--surface)] lg:flex-1">
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </div>
  );
}
