import { AdminDashboardLayout } from "../../../components/Layout/AdminDashboardLayout";
import { AdminLoginScreen } from "../../../components/Layout/AdminLoginScreen";
import { isLoggedIn } from "../../../utils/auth";
import { prisma } from "@repo/db";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function PurchaseRecordsPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminLoginScreen />;
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminDashboardLayout>
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Purchase Records</h1>
          <p className="mt-1 text-sm text-slate-600">Customer orders and item totals.</p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
            No orders have been placed yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-950">Order {order.id}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {order.user.email} · {new Intl.DateTimeFormat("en-AU").format(order.createdAt)} · {order.status}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-slate-950">{formatCurrency(order.totalAmount)}</p>
                </div>

                <div className="mt-4 overflow-hidden rounded border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2">Product</th>
                        <th className="px-3 py-2">Quantity</th>
                        <th className="px-3 py-2">Price paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2 text-slate-900">{item.product.name}</td>
                          <td className="px-3 py-2 text-slate-600">{item.quantity}</td>
                          <td className="px-3 py-2 text-slate-600">{formatCurrency(item.pricePaid)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminDashboardLayout>
  );
}
