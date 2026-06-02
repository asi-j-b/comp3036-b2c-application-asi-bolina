"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@repo/db/data";
import { useCart } from "@/hooks/useCart";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CheckoutView({
  products,
  userEmail,
}: {
  products: Product[];
  userEmail: string | null;
}) {
  const { cartItems, cartTotal, clearCart } = useCart(products);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  async function handleCreateOrder() {
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error ?? "Could not create order");
      setIsSubmitting(false);
      return;
    }

    setCreatedOrderId(data.order.id);
    clearCart();
    setIsSubmitting(false);
  }

  if (!userEmail) {
    return (
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
    );
  }

  if (createdOrderId) {
    return (
      <div className="mt-4 space-y-4">
        <p className="text-secondary">
          Order {createdOrderId} was created and is pending payment.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/account" className="rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light">
            View purchase history
          </Link>
          <Link href="/" className="rounded-md border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-secondary">You are signed in as {userEmail}.</p>

      {cartItems.length === 0 ? (
        <div className="mt-4">
          <p className="text-secondary">Your cart is empty.</p>
          <Link href="/" className="mt-3 inline-block rounded-md border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex justify-between gap-4 border-b border-[var(--ring)] pb-3 text-sm">
                <div>
                  <p className="font-medium text-primary">{item.product.name}</p>
                  <p className="text-secondary">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-primary">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="font-semibold text-secondary">Total</p>
            <p className="text-xl font-semibold text-primary">{formatCurrency(cartTotal)}</p>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCreateOrder}
              disabled={isSubmitting}
              className="rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating order..." : "Create order"}
            </button>
            <Link href="/cart" className="rounded-md border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu">
              Review cart
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
