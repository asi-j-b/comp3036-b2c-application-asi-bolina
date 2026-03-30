import type { PropsWithChildren } from "react";

export function LinkList({title, children}: PropsWithChildren <{title: string }>) {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-1">{title}</h3>
      <ul>
        {children}
      </ul>
    </section>
  )
}
