/*

import { client } from "./client.js";
import { products } from "./data.js";

export async function seed() {
  // TODO: Uncomment below once you set up Prisma and loaded data to your database
  console.log("🌱 Seeding data");
  // await client.db.like.deleteMany();
  await client.db.product.deleteMany();

  for (const product of products) {
    await client.db.product.create({
      data: {
        id: product.id,
        urlId: product.urlId,
        title: product.title,
        content: product.content,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        active: product.active,
        tags: product.tags,
      },
    });
  }
}

*/