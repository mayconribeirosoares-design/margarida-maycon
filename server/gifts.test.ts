import { describe, expect, it, vi } from "vitest";

const { reserveGiftItem } = vi.hoisted(() => ({ reserveGiftItem: vi.fn(async () => ({ reserved: true as const })) }));
vi.mock("./db", () => ({
  listGiftItems: vi.fn(async () => [{ id: 1, slug: "jogo-de-cama", title: "Jogo de cama", category: "Quarto & banho", description: "Para a nossa casa", reservedBy: null, reservedPhone: null, reservedAt: null, createdAt: new Date(), updatedAt: new Date() }]),
  reserveGiftItem,
  releaseGiftItem: vi.fn(async (id: number) => ({ id })),
  createRsvp: vi.fn(),
  listRsvps: vi.fn(),
  listArchivedRsvps: vi.fn(),
  archiveRsvp: vi.fn(),
  restoreRsvp: vi.fn(),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { COUPLE_PIN_COOKIE, createCouplePinToken } from "./couplePin";

function createContext(user: TrpcContext["user"] = null, cookie = ""): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: { cookie } } as TrpcContext["req"],
    res: { clearCookie: () => undefined, cookie: () => undefined } as TrpcContext["res"],
  };
}

async function authorizedContext() {
  const identifier = process.env.COUPLE_SECOND_EMAIL || "second-couple@example.com";
  const owner = {
    id: 4,
    openId: identifier,
    name: "Conta autorizada do casal",
    email: identifier,
    loginMethod: "manus",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const token = await createCouplePinToken(owner.openId);
  return createContext(owner, `${COUPLE_PIN_COOKIE}=${token}`);
}

describe("gift procedures", () => {
  it("lists gifts publicly", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.gifts.list()).resolves.toHaveLength(1);
  });

  it("reserves a gift with the guest identity", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.gifts.reserve({ slug: "jogo-de-cama", reservedBy: "Convidado" })).resolves.toEqual({ success: true });
    expect(reserveGiftItem).toHaveBeenCalledWith("jogo-de-cama", "Convidado", null);
  });

  it("turns a race for the same gift into a conflict", async () => {
    reserveGiftItem.mockResolvedValueOnce({ reserved: false });
    const caller = appRouter.createCaller(createContext());
    await expect(caller.gifts.reserve({ slug: "jogo-de-cama", reservedBy: "Outra pessoa" })).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("protects gift release for the couple", async () => {
    const visitor = appRouter.createCaller(createContext());
    await expect(visitor.gifts.release({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    const couple = appRouter.createCaller(await authorizedContext());
    await expect(couple.gifts.release({ id: 1 })).resolves.toEqual({ success: true, id: 1 });
  });
});
