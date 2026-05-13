import Link from "next/link";
import { AppLayout } from "@/components/Layout/AppLayout";

export default function CheckoutPage() {
	return (
		<AppLayout>
			<section className="w-full px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-6">
					<h1 className="text-2xl font-semibold text-primary">Checkout</h1>
					<p className="mt-2 text-secondary">
						To complete payment, please sign in or register an account.
					</p>
					<div className="mt-4 flex flex-wrap gap-3">
						<Link href="/login" className="rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light">
							Sign in
						</Link>
						<Link href="/register" className="rounded-md border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu">
							Register
						</Link>
					</div>
				</div>
			</section>
		</AppLayout>
	);
}