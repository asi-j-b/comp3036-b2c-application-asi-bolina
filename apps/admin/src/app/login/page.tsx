import { LoginForm } from "@repo/ui/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      {/* The UI comes from the package, but the URL comes from this folder */}
      <LoginForm actionUrl="/api/auth" isAdmin={true} />
    </main>
  );
}