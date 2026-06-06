import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { prisma } from "@repo/db";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  // 1. Fetch active products from the database (Safe for SQLite and Postgres)
  const allActiveProducts = await prisma.product.findMany({
    where: {
      active: true,
    },
    orderBy: { name: "asc" },
  });

  // 2. Perform safe, environment-independent case-insensitive array filtering in memory
  const filteredProducts = allActiveProducts.filter(
    (product) => product.category.toLowerCase() === name.toLowerCase()
  );

  return (
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}