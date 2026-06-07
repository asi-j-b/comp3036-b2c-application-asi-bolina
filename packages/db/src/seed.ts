import argon2 from "argon2";
import { Role } from "@prisma/client";
import { prisma } from "./client.js";
import { mockProducts } from "./data.js";

const seedUsers = [
  {
    email: "alicekingsley@gmail.com",
    password: "P@ssword123!",
    name: "Alice Kingsley",
    role: Role.CUSTOMER,
  },
  {
    email: "marcuschen@yahoo.com",
    password: "Secure#2026",
    name: "Marcus Chen",
    role: Role.CUSTOMER,
  },
  {
    email: "sarahjenkins@example.com",
    password: "B2c_Store99",
    name: "Sarah Jenkins",
    role: Role.CUSTOMER,
  },
  {
    email: "davidpatel@gmail.com",
    password: "Tr@ckW0rkout!",
    name: "David Patel",
    role: Role.CUSTOMER,
  },
  {
    email: "johnathanbradley@admin.com",
    password: "AdminPortal#1",
    name: "Johnathan Bradley",
    role: Role.ADMIN,
  },
  {
    email: "elenarostova@admin.com",
    password: "M@sterKey99!",
    name: "Elena Rostova",
    role: Role.ADMIN,
  },
] as const;

export async function seed() {
  console.log("⏳ Initializing database teardown...");

  try {
    // 🟢 STRONGLY TYPED TEARDOWN: Clears old mock orders first.
    // Thanks to your onDelete: Cascade configuration, deleting Orders automatically flushes all OrderItems cleanly!
    await prisma.order.deleteMany({});
    
    // Clear out baseline product listings and user accounts completely
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log("🧹 Tables cleared successfully. Rebuilding pristine seed entries...");
  } catch (error) {
    console.warn("⚠️ Teardown warning:", error);
  }

  // Populate Users
  for (const user of seedUsers) {
    const hashedPassword = await argon2.hash(user.password, { type: argon2.argon2id });

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: hashedPassword,
        name: user.name,
        role: user.role,
        active: true,
      },
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: user.role,
        active: true,
      },
    });
  }

  // Populate Products
  for (const product of mockProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        imageUrl: product.imageUrl,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured ?? false,
        active: product.active,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        imageUrl: product.imageUrl,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured ?? false,
        active: product.active,
      },
    });
  }
  
  console.log("✅ Database successfully reset and rebuilt with pristine mock data records!");
}

export async function seedAndDisconnect() {
  try {
    await seed();
  } finally {
    await prisma.$disconnect();
  }
}