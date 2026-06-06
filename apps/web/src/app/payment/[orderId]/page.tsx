import Link from "next/link";
import { PayNowButton } from "./PayNowButton";

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
        <form className="mt-4">
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiry"
              name="expiry"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
              CVC
            </label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <PayNowButton orderId={orderId} />
        </form>
      </div>
    </div>
  );
}