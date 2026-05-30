import { AdminDashboardLayout } from "../../../components/Layout/AdminDashboardLayout";
import { AdminLoginScreen } from "../../../components/Layout/AdminLoginScreen";
import { isLoggedIn } from "../../../utils/auth";

export default async function PurchaseRecordsPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminLoginScreen />;
  }

  return (
    <AdminDashboardLayout>
      <h1>View Purchase Records</h1>
    </AdminDashboardLayout>
  );
}
