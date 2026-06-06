export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">Mock Payment</h1>

      <p className="mt-4 text-secondary">
        Order ID: {orderId}
      </p>

      <div className="mt-6 rounded-md border border-[var(--ring)] p-6">
        <p className="font-semibold">
          This is a mock payment page.
        </p>

        <p className="mt-2 text-secondary">
          Payment functionality will be added next.
        </p>
      </div>
    </div>
  );
}