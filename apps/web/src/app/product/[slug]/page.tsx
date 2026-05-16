import Link from "next/link";
import { notFound } from "next/navigation";
import { AppLayout } from "@/components/Layout/AppLayout";
import { mockProducts } from "@repo/db/data";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = mockProducts.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <AppLayout>
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-2xl border border-[var(--ring)] bg-[var(--surface)] p-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-[var(--surface-muted)]">
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">{product.category}</p>
            <h1 className="text-3xl font-semibold text-primary">{product.name}</h1>
            <p className="text-sm text-secondary">Rating: {product.rating.toFixed(1)} ({product.reviews} reviews)</p>
            <p className="text-2xl font-semibold text-primary">{formatCurrency(product.price)}</p>
            <p className="leading-7 text-secondary">{product.description}</p>
            <p className="text-sm text-secondary">{product.stock} in stock</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/"
                className="rounded-md border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu"
              >
                Back to products
              </Link>
              <Link
                href="/cart"
                className="rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light"
              >
                Go to cart
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
