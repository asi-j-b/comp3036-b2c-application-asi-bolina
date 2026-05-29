import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { UserRegisterForm } from "@/components/auth/UserRegisterForm";
import { env } from "@repo/env/web";

async function isAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { email?: string };
    return Boolean(decoded.email);
  } catch {
    return false;
  }
}

export default async function UserRegisterPage() {
  if (await isAuthenticatedUser()) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <UserRegisterForm />
    </main>
  );
}