import Link from "next/link";
import { AppLayout } from "@/components/Layout/AppLayout";
import { getPurchaseTotal, mockPurchases } from "@/data/mockPurchases";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function PurchasesPage() {
  return (
    <AppLayout>
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-wsu">Account</p>
            <h1 className="text-3xl font-semibold text-primary">Purchase records</h1>
            <p className="mt-2 max-w-2xl text-sm text-secondary">
              Review recent orders, their fulfilment status, and the products included in each purchase.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-md border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu"
          >
            Continue shopping
          </Link>
        </div>

        <div className="space-y-4">
          {mockPurchases.map((purchase) => (
            <article
              key={purchase.id}
              className="rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ring)] pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-primary">Order {purchase.id}</h2>
                  <p className="text-sm text-secondary">Placed {formatDate(purchase.date)}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-wsu/10 px-3 py-1 text-sm font-semibold text-wsu">
                    {purchase.status}
                  </span>
                  <p className="mt-2 text-lg font-semibold text-primary">
                    {formatCurrency(getPurchaseTotal(purchase))}
                  </p>
                </div>
              </div>

              <ul className="mt-4 divide-y divide-[var(--ring)]">
                {purchase.items.map((item) => (
                  <li key={`${purchase.id}-${item.product.id}`} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium text-primary">{item.product.name}</p>
                      <p className="text-sm text-secondary">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
