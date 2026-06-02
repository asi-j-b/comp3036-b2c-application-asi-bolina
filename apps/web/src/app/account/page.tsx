import Link from "next/link";
import { AppLayout } from "@/components/Layout/AppLayout";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCustomerSession } from "@/utils/auth";
import { prisma } from "@repo/db";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AccountPage() {
  const session = await getCustomerSession();
  const orders = session?.id
    ? await prisma.order.findMany({
        where: { userId: session.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <AppLayout>
      <section className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-xl rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-6">
          <h1 className="text-2xl font-semibold text-primary">Account</h1>

          {session ? (
            <>
              <p className="mt-2 text-secondary">Signed in as {session.email}</p>
              <div className="mt-5">
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-secondary">You are not signed in.</p>
              <Link
                href="/login"
                className="mt-5 inline-block rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        {session ? (
          <div className="rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold text-primary">Purchase history</h2>

            {orders.length === 0 ? (
              <p className="mt-3 text-secondary">No orders yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-lg border border-[var(--ring)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-primary">Order {order.id}</p>
                        <p className="text-sm text-secondary">
                          {new Intl.DateTimeFormat("en-AU").format(order.createdAt)} · {order.status}
                        </p>
                      </div>
                      <p className="font-semibold text-primary">{formatCurrency(order.totalAmount)}</p>
                    </div>

                    <ul className="mt-3 space-y-2 text-sm text-secondary">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.product.name} · Qty {item.quantity} · {formatCurrency(item.pricePaid)} each
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
