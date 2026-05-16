import { AdminDashboardLayout } from "../../../components/Layout/AdminDashboardLayout";
import { AdminLoginScreen } from "../../../components/Layout/AdminLoginScreen";
import { isLoggedIn } from "../../../utils/auth";

export default async function ManageProductsPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminLoginScreen />;
  }

  return (
    <AdminDashboardLayout>
      <h1>Manage Products</h1>
    </AdminDashboardLayout>
  );
}
