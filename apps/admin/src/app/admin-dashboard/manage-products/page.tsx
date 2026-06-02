import { AdminDashboardLayout } from "../../../components/Layout/AdminDashboardLayout";
import { AdminLoginScreen } from "../../../components/Layout/AdminLoginScreen";
import { AdminList } from "../../../components/AdminList";
import { isLoggedIn } from "../../../utils/auth";
import { prisma } from "@repo/db";

export default async function ManageProductsPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminLoginScreen />;
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-slate-950">Manage Products</h1>
        <AdminList products={products} />
      </div>
    </AdminDashboardLayout>
  );
}
