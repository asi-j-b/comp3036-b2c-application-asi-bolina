import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { prisma } from "@repo/db";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const filteredProducts = await prisma.product.findMany({
    where: {
      active: true,
      category: {
        equals: name,
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
