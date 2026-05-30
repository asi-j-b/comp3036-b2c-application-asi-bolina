import Link from "next/link";
import { AppLayout } from "@/components/Layout/AppLayout";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCustomerEmail } from "@/utils/auth";

export default async function AccountPage() {
  const userEmail = await getCustomerEmail();

  return (
    <AppLayout>
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-xl rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-6">
          <h1 className="text-2xl font-semibold text-primary">Account</h1>

          {userEmail ? (
            <>
              <p className="mt-2 text-secondary">Signed in as {userEmail}</p>
              <div className="mt-5">
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-secondary">You are not signed in.</p>
              <Link
                href="/login"
                className="mt-5 inline-block rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
