import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <Link href="/dashboard/inventory">View Inventory</Link>
        </li>
        <li>
          <Link href="/dashboard/manage-products">Manage Products</Link>
        </li>
        <li>
          <Link href="/dashboard/purchase-records">View Purchase Records</Link>
        </li>
      </ul>
    </main>
  );
}
