import { redirect } from "next/navigation";
import { UserLoginForm } from "@/components/auth/UserLoginForm";
import { isCustomerAuthenticated } from "@/utils/auth";

export const metadata = {
  title: "Login | FSD",
};

export default async function UserLoginPage() {
  if (await isCustomerAuthenticated()) {
    redirect("/account");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <UserLoginForm />
    </main>
  );
}
