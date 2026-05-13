import Link from "next/link";
import { AppLayout } from "@/components/Layout/AppLayout";

export default function RegisterPage() {
	return (
		<AppLayout>
			<section className="w-full px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-6">
					<h1 className="text-2xl font-semibold text-primary">Register</h1>
					<p className="mt-2 text-secondary">
						Registration form will be added next. For now, use existing credentials from your environment file.
					</p>
					<Link href="/login" className="mt-4 inline-block rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light">
						Go to sign in
					</Link>
				</div>
			</section>
		</AppLayout>
	);
}