import { AdminDashboardLayout } from "../../../components/Layout/AdminDashboardLayout";
import { AdminLoginScreen } from "../../../components/Layout/AdminLoginScreen";
import { isLoggedIn } from "../../../utils/auth";
import { prisma } from "@repo/db";

export default async function InventoryPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminLoginScreen />;
  }

  const products = await prisma.product.findMany({
    orderBy: [{ stock: "asc" }, { name: "asc" }],
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold text-slate-950">View Inventory</h1>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{product.category}</td>
                  <td className="px-4 py-3 text-slate-600">{product.stock}</td>
                  <td className="px-4 py-3 text-slate-600">{product.active ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
