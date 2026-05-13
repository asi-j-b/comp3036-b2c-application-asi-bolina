import { AppLayout } from "@/components/Layout/AppLayout";
import { UserLoginForm } from "../../../../../packages/ui/src/auth/UserLoginForm";

export default function LoginPage() {
  return (
    <AppLayout>
      <div className="flex flex-1 items-center justify-center py-12">
        <UserLoginForm />
      </div>
    </AppLayout>
  );
}