import Link from "next/link";
import { AppLayout } from "@/components/Layout/AppLayout";
import { getCustomerEmail } from "@/utils/auth";

export default async function CheckoutPage() {
  const userEmail = await getCustomerEmail();

	return (
		<AppLayout>
			<section className="w-full px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-6">
					<h1 className="text-2xl font-semibold text-primary">Checkout</h1>
					{userEmail ? (
						<>
							<p className="mt-2 text-secondary">
								You are signed in as {userEmail}. This is the mock checkout step for Iteration 1.
							</p>
							<div className="mt-4 flex flex-wrap gap-3">
								<Link href="/cart" className="rounded-md border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu">
									Review cart
								</Link>
								<Link href="/account" className="rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light">
									Account
								</Link>
							</div>
						</>
					) : (
						<>
							<p className="mt-2 text-secondary">
								To complete payment, please sign in to your account.
							</p>
							<div className="mt-4 flex flex-wrap gap-3">
								<Link href="/login" className="rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light">
									Sign in
								</Link>
							</div>
						</>
					)}
				</div>
			</section>
		</AppLayout>
	);
}
