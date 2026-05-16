import { AdminLoginForm } from "../auth/AdminLoginForm";

export function AdminLoginScreen() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
        <AdminLoginForm />
      </section>
    </main>
  );
}
