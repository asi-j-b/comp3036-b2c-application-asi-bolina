import type { PropsWithChildren } from "react";
import { AppLayoutClient } from "./AppLayoutClient";

export async function AppLayout({
  children,
}: PropsWithChildren) {
  return (
    <AppLayoutClient>
      {children}
    </AppLayoutClient>
  );
}
