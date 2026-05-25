import Stripe from "stripe";
import { NextResponse } from "next/server";
import { mockProducts } from "@repo/db/data";

type CartItemInput = {
  productId: number;
  quantity: number;
};

type CheckoutRequestBody = {
  items?: CartItemInput[];
};

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY environment variable." },
      { status: 500 },
    );
  }

  if (!stripeSecretKey.startsWith("sk_") && !stripeSecretKey.startsWith("rk_")) {
    return NextResponse.json(
      {
        error:
          "STRIPE_SECRET_KEY must be a server key (sk_... or rk_...). Do not use a publishable pk_ key here.",
      },
      { status: 500 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  let body: CheckoutRequestBody;

  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }
  const normalizedItems = (body.items ?? [])
    .map((item) => {
      const product = mockProducts.find((entry) => entry.id === item.productId);

      if (!product || !product.active) {
        return null;
      }

      const quantity = Number.isInteger(item.quantity) ? item.quantity : Number(item.quantity);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        return null;
      }

      return {
        product,
        quantity: Math.floor(quantity),
      };
    })
    .filter((item): item is { product: (typeof mockProducts)[number]; quantity: number } => item !== null);

  if (normalizedItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3001";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: normalizedItems.map(({ product, quantity }) => ({
        quantity,
        price_data: {
          currency: "aud",
          product_data: {
            name: product.name,
            images: [product.imageUrl],
          },
          unit_amount: Math.round(product.price * 100),
        },
      })),
      success_url: `${origin}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Stripe checkout session creation failed.",
      },
      { status: 500 },
    );
  }
}