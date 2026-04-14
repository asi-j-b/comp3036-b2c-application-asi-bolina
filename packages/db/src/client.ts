import { PrismaClient } from "@prisma/client";
import { env } from "@repo/env/web";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const createClient = () => {
  if (global.prismaGlobal) {
    return global.prismaGlobal;
  }

  const URL = env.DATABASE_URL;

  const prisma = new PrismaClient({
    datasourceUrl: URL,
  });

  console.log("Connected to database");
  console.log(URL);

  global.prismaGlobal = prisma;
  return prisma;
};

export const prisma = global.prismaGlobal || createClient();

export const client = {
  get db() {
    return createClient();
  },
};
