import type { PropsWithChildren } from "react";
import { prisma } from "@repo/db";
import { AppLayoutClient } from "./AppLayoutClient";

export async function AppLayout({
  children,
}: PropsWithChildren) {
  const sidebarProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { category: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      price: true,
      category: true,
      stock: true,
      imageUrl: true,
      rating: true,
      reviews: true,
      featured: true,
      active: true,
    },
  });

  return (
    <AppLayoutClient products={sidebarProducts}>
      {children}
    </AppLayoutClient>
  );
}
