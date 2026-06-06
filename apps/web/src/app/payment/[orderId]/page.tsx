import Link from "next/link";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">
        Mock Payment
      </h1>

      <p className="mt-4 text-secondary">
        Order ID: {orderId}
      </p>

      <div className="mt-6 rounded-md border border-[var(--ring)] p-6">
        <p className="font-semibold">
          Test Payment Gateway
        </p>

        <p className="mt-2 text-secondary">
          This payment page is for demonstration purposes.
        </p>

        <button
          type="button"
          className="mt-6 rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}