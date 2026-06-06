import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@repo/db";
import { getCustomerSession } from "@/utils/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const session = await getCustomerSession();

  if (!session?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 },
    );
  }

  if (order.userId !== session.id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: OrderStatus.COMPLETED,
    },
  });

  return NextResponse.json({
    success: true,
    order: updatedOrder,
  });
}