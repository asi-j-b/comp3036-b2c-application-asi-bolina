import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@repo/db";
import { getCustomerSession } from "@/utils/auth";

type IncomingCartItem = {
  productId?: unknown;
  quantity?: unknown;
};

export async function GET() {
  const session = await getCustomerSession();

  if (!session?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              name: true,
              imageUrl: true,
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const session = await getCustomerSession();

  if (!session?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const incomingItems = Array.isArray(body.items) ? (body.items as IncomingCartItem[]) : [];
    const quantitiesByProductId = new Map<string, number>();

    for (const item of incomingItems) {
      const productId = String(item.productId ?? "");
      const quantity = Number(item.quantity);

      if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
      }

      quantitiesByProductId.set(
        productId,
        (quantitiesByProductId.get(productId) ?? 0) + quantity,
      );
    }

    if (quantitiesByProductId.size === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const productIds = [...quantitiesByProductId.keys()];
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          active: true,
        },
      });

      if (products.length !== productIds.length) {
        throw new Error("One or more products are unavailable");
      }

      const orderItems = products.map((product) => {
        const quantity = quantitiesByProductId.get(product.id) ?? 0;

        if (product.stock < quantity) {
          throw new Error(`${product.name} does not have enough stock`);
        }

        return {
          productId: product.id,
          quantity,
          pricePaid: product.price,
        };
      });

      const totalAmount = orderItems.reduce(
        (total, item) => total + item.pricePaid * item.quantity,
        0,
      );

      const createdOrder = await tx.order.create({
        data: {
          userId: session.id!,
          totalAmount,
          status: OrderStatus.PENDING,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of orderItems) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (result.count !== 1) {
          throw new Error("Stock changed while creating the order");
        }
      }

      return createdOrder;
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create order" },
      { status: 400 },
    );
  }
}
