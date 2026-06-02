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
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
