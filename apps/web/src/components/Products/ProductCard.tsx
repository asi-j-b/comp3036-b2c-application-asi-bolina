import { useEffect, useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftQuantity, setDraftQuantity] = useState("1");
  const [savedQuantity, setSavedQuantity] = useState("1");

  useEffect(() => {
    if (isModalOpen) {
      setDraftQuantity(savedQuantity);
    }
  }, [isModalOpen, savedQuantity]);

  const closeModal = () => {
    setDraftQuantity(savedQuantity);
    setIsModalOpen(false);
  };

  const saveChanges = () => {
    setSavedQuantity(draftQuantity);
    setIsModalOpen(false);
  };

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
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-full border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary transition hover:border-wsu hover:text-wsu"
            >
              View
            </button>
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

      {isModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`product-modal-title-${product.id}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
        >
          <div className="relative w-full max-w-2xl rounded-[2rem] bg-[var(--surface)] p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Close product details"
              onClick={closeModal}
              className="absolute right-5 top-5 rounded-full border border-[var(--ring)] px-3 py-1 text-lg font-semibold text-primary transition hover:border-wsu hover:text-wsu"
            >
              ×
            </button>

            <div className="grid gap-6 md:grid-cols-[220px,1fr]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt=""
                className="h-56 w-full rounded-3xl object-cover"
              />
              <div className="space-y-4 pr-0 md:pr-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                    {product.category}
                  </p>
                  <h2 id={`product-modal-title-${product.id}`} className="mt-1 text-3xl font-semibold text-primary">
                    {product.name}
                  </h2>
                </div>

                <p className="text-sm leading-6 text-secondary">{product.description}</p>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-[var(--surface-muted)] p-3">
                    <dt className="text-secondary">Price</dt>
                    <dd className="font-semibold text-primary">{formatCurrency(product.price)}</dd>
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-muted)] p-3">
                    <dt className="text-secondary">Rating</dt>
                    <dd className="font-semibold text-primary">{product.rating.toFixed(1)} from {product.reviews} reviews</dd>
                  </div>
                </dl>

                <label className="block text-sm font-semibold text-primary">
                  Preferred quantity
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={draftQuantity}
                    onChange={(event) => setDraftQuantity(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[var(--ring)] bg-[var(--surface)] px-4 py-3 text-primary focus:border-wsu focus:outline-none focus:ring-2 focus:ring-wsu/30"
                  />
                </label>

                <div className="flex flex-wrap justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-[var(--ring)] px-5 py-2 text-sm font-semibold text-primary transition hover:border-wsu hover:text-wsu"
                  >
                    Cancel changes
                  </button>
                  <button
                    type="button"
                    onClick={saveChanges}
                    className="rounded-full bg-wsu px-5 py-2 text-sm font-semibold text-white transition hover:bg-wsu-light focus:outline-none focus:ring-2 focus:ring-wsu focus:ring-offset-2"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
