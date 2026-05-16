import { LoginForm } from "@repo/ui/auth/LoginForm";

export default function UserLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <LoginForm actionUrl="/api/auth" isAdmin={false} />
    </div>
  );
}