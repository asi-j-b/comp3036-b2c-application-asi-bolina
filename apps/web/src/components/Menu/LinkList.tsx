import type { PropsWithChildren } from "react";

export function LinkList({title, children}: PropsWithChildren <{title: string }>) {
  return (
    <section className="pt-5 first:pt-0">
      <h3 className="mb-2 px-2 text-xs font-semibold text-secondary">
        {title}
      </h3>
      <ul className="space-y-1">
        {children}
      </ul>
    </section>
  )
}
