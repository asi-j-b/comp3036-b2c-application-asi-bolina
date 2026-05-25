"use client";

import { useState } from "react";
import Link from "next/link";
import { mockProducts } from "@repo/db/data";
import { useCart } from "@/hooks/useCart";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CartView() {
  const { cartItems, cartTotal, addToCart, removeFromCart, clearCart } = useCart(mockProducts);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleStripeCheckout() {
    if (cartItems.length === 0) {
      return;
    }

    setIsRedirectingToStripe(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
        }),
      });

      const rawBody = await response.text();
      let data: { url?: string; error?: string } = {};

      if (rawBody) {
        try {
          data = JSON.parse(rawBody) as { url?: string; error?: string };
        } catch {
          data = { error: rawBody };
        }
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to create a Stripe checkout session.");
      }

      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout.");
    } finally {
      setIsRedirectingToStripe(false);
    }
  }

  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold text-primary">Your cart</h1>
        {cartItems.length > 0 ? (
          <button
            type="button"
            onClick={clearCart}
            className="rounded-md border border-[var(--ring)] px-3 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu"
          >
            Clear cart
          </button>
        ) : null}
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-6">
          <p className="text-secondary">Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block text-sm font-semibold text-wsu hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--ring)] bg-[var(--surface)] p-4"
            >
              <div>
                <p className="font-semibold text-primary">{product.name}</p>
                <p className="text-sm text-secondary">{formatCurrency(product.price)} each</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  className="rounded-md border border-[var(--ring)] px-3 py-1 text-sm font-semibold text-primary"
                >
                  -
                </button>
                <span className="min-w-6 text-center text-sm font-semibold text-primary">{quantity}</span>
                <button
                  type="button"
                  onClick={() => addToCart(product.id)}
                  className="rounded-md border border-[var(--ring)] px-3 py-1 text-sm font-semibold text-primary"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-[var(--ring)] pt-4">
            <p className="text-sm font-semibold text-secondary">Total</p>
            <p className="text-2xl font-semibold text-primary">{formatCurrency(cartTotal)}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStripeCheckout}
              disabled={isRedirectingToStripe}
              className="rounded-md bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRedirectingToStripe ? "Redirecting to Stripe..." : "Checkout"}
            </button>
            <Link
              href="/"
              className="rounded-md border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu"
            >
              Continue shopping
            </Link>
          </div>

          {checkoutError ? <p className="text-sm text-red-500">{checkoutError}</p> : null}
        </div>
      )}
    </section>
  );
}
