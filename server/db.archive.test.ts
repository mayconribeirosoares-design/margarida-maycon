import { beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => {
  const where = vi.fn(async () => undefined);
  const set = vi.fn(() => ({ where }));
  const update = vi.fn(() => ({ set }));
  return { where, set, update };
});

vi.mock("drizzle-orm/mysql2", () => ({ drizzle: () => database }));

import { archiveRsvp, restoreRsvp } from "./db";

describe("RSVP archive persistence contract", () => {
  beforeEach(() => vi.clearAllMocks());

  it("persists an archive timestamp without deleting the record", async () => {
    await archiveRsvp(42);
    expect(database.update).toHaveBeenCalledTimes(1);
    expect(database.set).toHaveBeenCalledWith({ archivedAt: expect.any(Date) });
    expect(database.where).toHaveBeenCalledTimes(1);
  });

  it("persists restoration by clearing the archive timestamp", async () => {
    await restoreRsvp(42);
    expect(database.update).toHaveBeenCalledTimes(1);
    expect(database.set).toHaveBeenCalledWith({ archivedAt: null });
    expect(database.where).toHaveBeenCalledTimes(1);
  });
});
