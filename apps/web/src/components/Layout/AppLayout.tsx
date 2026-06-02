import type { PropsWithChildren } from "react";
import { prisma } from "@repo/db";
import { AppLayoutClient } from "./AppLayoutClient";

export async function AppLayout({
  children,
}: PropsWithChildren) {
  const sidebarProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { category: "asc" },
  });

  return (
    <AppLayoutClient products={sidebarProducts}>
      {children}
    </AppLayoutClient>
  );
}
