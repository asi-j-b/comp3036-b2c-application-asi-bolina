import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { UserLoginForm } from "@/components/auth/UserLoginForm";
import { env } from "@repo/env/web";

async function isAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { role?: string };
    return decoded.role === "user";
  } catch {
    return false;
  }
}

export default async function UserLoginPage() {
  if (await isAuthenticatedUser()) {
    redirect("/account");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <UserLoginForm />
    </main>
  );
}
