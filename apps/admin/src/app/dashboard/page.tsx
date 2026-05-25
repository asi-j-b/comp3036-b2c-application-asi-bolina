import Link from "next/link";
import { AdminDashboardLayout } from "../../components/Layout/AdminDashboardLayout";
import { AdminLoginScreen } from "../../components/Layout/AdminLoginScreen";
import { isLoggedIn } from "../../utils/auth";

const dashboardLinks = [
  {
    href: "/admin-dashboard/inventory",
    label: "View Inventory",
    description: "Review product stock levels and availability.",
  },
  {
    href: "/admin-dashboard/manage-products",
    label: "Manage Products",
    description: "Add, update, and remove storefront products.",
  },
  {
    href: "/admin-dashboard/purchase-records",
    label: "View Purchase Records",
    description: "Check customer purchase activity and totals.",
  },
];

export default async function AdminDashboardPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminLoginScreen />;
  }

  return (
    <AdminDashboardLayout>
      <section className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Store management</h1>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {dashboardLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-44 rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-slate-950">{item.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </AdminDashboardLayout>
  );
}
