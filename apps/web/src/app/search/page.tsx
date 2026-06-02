import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { prisma } from "@repo/db";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const searchTerm = q?.trim() || "";

  const filteredProducts = await prisma.product.findMany({
    where: {
      active: true,
      OR: searchTerm
        ? [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
          ]
        : undefined,
    },
    orderBy: { name: "asc" },
  });

  return (
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
