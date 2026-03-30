import type { PropsWithChildren } from "react";

export function LinkList({title, children}: PropsWithChildren <{title: string }>) {
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {children}
      </ul>
    </section>
  )
}
