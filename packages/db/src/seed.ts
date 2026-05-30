import argon2 from "argon2";
import { Role } from "@prisma/client";
import { prisma } from "./client.js";

export async function seed() {
  await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {
      password: await argon2.hash("password123", { type: argon2.argon2id }),
      role: Role.CUSTOMER,
      active: true,
    },
    create: {
      email: "alice@example.com",
      password: await argon2.hash("password123", { type: argon2.argon2id }),
      name: "Alice Customer",
      role: Role.CUSTOMER,
      active: true,
    },
  });
}

export async function seedAndDisconnect() {
  try {
    await seed();
  } finally {
    await prisma.$disconnect();
  }
}
