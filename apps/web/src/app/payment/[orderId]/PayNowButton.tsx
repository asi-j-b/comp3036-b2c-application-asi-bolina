"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PayNowButton({
  orderId,
}: {
  orderId: string;
}) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/orders/${orderId}/pay`,
        {
          method: "PATCH",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Payment failed",
        );
      }

      router.push("/account");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {error ? (
        <p className="mt-4 text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handlePayment}
        disabled={isSubmitting}
        className="mt-6 rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light disabled:opacity-60"
      >
        {isSubmitting
          ? "Processing..."
          : "Pay Now"}
      </button>
    </>
  );
}