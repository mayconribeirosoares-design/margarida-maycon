import { and, desc, eq, isNull, isNotNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { GiftItem, InsertRsvp, InsertUser, giftItems, rsvps, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  const isCoupleOwner = user.openId === ENV.ownerOpenId;
  const isSecondCoupleAccount = Boolean(user.email && process.env.COUPLE_SECOND_EMAIL && user.email === process.env.COUPLE_SECOND_EMAIL);
  if (user.role !== undefined || isCoupleOwner || isSecondCoupleAccount) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function createRsvp(input: InsertRsvp) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(rsvps).values(input);
  return { id: result[0].insertId };
}

export async function listRsvps() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rsvps).where(isNull(rsvps.archivedAt)).orderBy(desc(rsvps.createdAt));
}

export async function listArchivedRsvps() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rsvps).where(isNotNull(rsvps.archivedAt)).orderBy(desc(rsvps.archivedAt));
}

export async function archiveRsvp(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(rsvps).set({ archivedAt: new Date() }).where(and(eq(rsvps.id, id), isNull(rsvps.archivedAt)));
  return { id };
}

export async function restoreRsvp(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(rsvps).set({ archivedAt: null }).where(and(eq(rsvps.id, id), isNotNull(rsvps.archivedAt)));
  return { id };
}

export async function listGiftItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(giftItems).orderBy(giftItems.category, giftItems.title);
}

export async function reserveGiftItem(slug: string, reservedBy: string, reservedPhone?: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.update(giftItems).set({ reservedBy, reservedPhone: reservedPhone || null, reservedAt: new Date() }).where(and(eq(giftItems.slug, slug), isNull(giftItems.reservedAt)));
  if (result[0].affectedRows === 0) return { reserved: false as const };
  return { reserved: true as const };
}

export async function releaseGiftItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(giftItems).set({ reservedBy: null, reservedPhone: null, reservedAt: null }).where(eq(giftItems.id, id));
  return { id };
}
