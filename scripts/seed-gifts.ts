import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { and, notInArray, isNull } from "drizzle-orm";
import { giftItems } from "../drizzle/schema";
import { giftCatalog } from "../shared/gifts";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

  const client = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(client);
  const slugs = giftCatalog.map((item) => item.slug);

  await db.delete(giftItems).where(and(notInArray(giftItems.slug, slugs), isNull(giftItems.reservedAt)));

  for (const item of giftCatalog) {
    await db.insert(giftItems).values(item).onDuplicateKeyUpdate({
      set: { title: item.title, category: item.category, description: item.description },
    });
  }

  await client.end();
  console.log(`Seeded ${giftCatalog.length} gift items`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
