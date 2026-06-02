import { AppLayout } from "@/components/Layout/AppLayout";
import { CheckoutView } from "@/components/Checkout/CheckoutView";
import { getCustomerEmail } from "@/utils/auth";
import { prisma } from "@repo/db";

export default async function CheckoutPage() {
  const userEmail = await getCustomerEmail();
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

	return (
		<AppLayout>
			<section className="w-full px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-6">
					<h1 className="text-2xl font-semibold text-primary">Checkout</h1>
					<CheckoutView products={products} userEmail={userEmail} />
				</div>
			</section>
		</AppLayout>
	);
}
