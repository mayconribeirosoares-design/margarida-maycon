import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { giftItems } from "../drizzle/schema";
import { giftCatalog } from "../shared/gifts";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

  const client = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(client);

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
