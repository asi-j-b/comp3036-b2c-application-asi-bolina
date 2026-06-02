import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const createClient = () => {
  if (global.prismaGlobal) {
    return global.prismaGlobal;
  }

  const prisma = new PrismaClient();

  console.log("Connected to database");

  global.prismaGlobal = prisma;
  return prisma;
};

export const prisma = global.prismaGlobal || createClient();

export const client = {
  get db() {
    return createClient();
  },
};
