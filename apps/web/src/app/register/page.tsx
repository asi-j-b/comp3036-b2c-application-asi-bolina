import { redirect } from "next/navigation";
import { UserRegisterForm } from "@/components/auth/UserRegisterForm";
import { isCustomerAuthenticated } from "@/utils/auth";

export default async function RegisterPage() {
  if (await isCustomerAuthenticated()) {
    redirect("/account");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <UserRegisterForm />
    </main>
  );
}
