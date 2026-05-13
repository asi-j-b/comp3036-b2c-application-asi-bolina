import Link from "next/link";
import type { Product } from "../../data/mockProducts";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0, // since all our prices are whole numbers, we can omit the decimal places
  }).format(value);
}

export function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (productId: number) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[var(--ring)] bg-[var(--surface)] 
    shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)] dark:shadow-none">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-wsu px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Featured
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
              {product.category}
            </p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-primary">
              {product.name}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-primary">
            <span aria-hidden="true">★</span>
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ring)] pt-4">
          <div>
            <p className="text-2xl font-semibold text-primary">
              {formatCurrency(product.price)}
            </p>
            <p className="text-sm text-secondary">{product.stock} in stock</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="rounded-full border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary transition hover:border-wsu hover:text-wsu"
            >
              View
            </Link>
            <button
              type="button"
              onClick={() => onAddToCart(product.id)}
              className="rounded-full bg-wsu px-4 py-2 text-sm font-semibold text-white transition hover:bg-wsu-light focus:outline-none focus:ring-2 focus:ring-wsu focus:ring-offset-2"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}