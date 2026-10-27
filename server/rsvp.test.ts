import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  createRsvp: vi.fn(async () => ({ id: 123 })),
  listRsvps: vi.fn(async () => []),
  listArchivedRsvps: vi.fn(async () => []),
  archiveRsvp: vi.fn(async (id: number) => ({ id })),
  restoreRsvp: vi.fn(async (id: number) => ({ id })),
}));
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { COUPLE_PIN_COOKIE, createCouplePinToken } from "./couplePin";

function createContext(user: TrpcContext["user"] = null, cookie = "", onCookie: (name: string, value?: string) => void = () => undefined, onClear: (name: string) => void = () => undefined): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: { cookie } } as TrpcContext["req"],
    res: { clearCookie: onClear, cookie: onCookie } as TrpcContext["res"],
  };
}

function coupleUser() {
  const identifier = process.env.COUPLE_SECOND_EMAIL || "second-couple@example.com";
  return {
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
}

function ownerUser() {
  return {
    id: 1,
    openId: process.env.OWNER_OPEN_ID || "owner",
    name: "Owner",
    email: "owner@example.com",
    loginMethod: "manus",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

async function createAuthorizedContext(user = coupleUser()) {
  const token = await createCouplePinToken(user.openId);
  return createContext(user, `${COUPLE_PIN_COOKIE}=${token}`);
}

describe("rsvp procedures", () => {
  it("rejects an invalid guest name before persistence", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.rsvp.submit({
      guestName: "x",
      status: "confirmed",
      companions: 0,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("accepts a site-only confirmation without phone or WhatsApp", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.rsvp.submit({
      guestName: "Convidado sem WhatsApp",
      status: "confirmed",
      companions: 0,
    })).resolves.toEqual({ success: true, id: 123 });
  });

  it("accepts the configured PIN for the single authorized couple account", async () => {
    let cookieName = "";
    const caller = appRouter.createCaller(createContext(coupleUser(), "", (name: string) => { cookieName = name; }));
    await expect(caller.rsvp.verifyPin({ pin: process.env.COUPLE_ACCESS_PIN || "0000" })).resolves.toEqual({ success: true });
    expect(cookieName).toBe(COUPLE_PIN_COOKIE);
  });

  it("allows direct access with only the configured email and PIN", async () => {
    let cookie = "";
    const identifier = process.env.COUPLE_SECOND_EMAIL || "second-couple@example.com";
    const loginCaller = appRouter.createCaller(createContext(null, "", (name, value) => { cookie = `${name}=${value}`; }));
    await expect(loginCaller.rsvp.loginWithCredentials({ email: identifier, pin: process.env.COUPLE_ACCESS_PIN || "0000" })).resolves.toEqual({ success: true });
    const authorizedCaller = appRouter.createCaller(createContext(null, cookie));
    await expect(authorizedCaller.rsvp.access()).resolves.toMatchObject({ pinVerified: true });
    await expect(authorizedCaller.rsvp.list()).resolves.toEqual([]);
  });

  it("clears the direct couple session on logout", async () => {
    let clearedCookie = "";
    const caller = appRouter.createCaller(createContext(null, "", () => undefined, name => { clearedCookie = name; }));
    await expect(caller.rsvp.logout()).resolves.toEqual({ success: true });
    expect(clearedCookie).toBe(COUPLE_PIN_COOKIE);
  });

  it("rejects an incorrect couple PIN", async () => {
    const caller = appRouter.createCaller(createContext(coupleUser()));
    await expect(caller.rsvp.verifyPin({ pin: "0000" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("blocks the private list for unauthenticated guests", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.rsvp.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks the private list for an admin outside the authorized email", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 3,
      openId: "other-admin",
      name: "Other Admin",
      email: "other-admin@example.com",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.rsvp.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks the project owner when the owner is not the authorized email", async () => {
    const caller = appRouter.createCaller(createContext(ownerUser()));
    await expect(caller.rsvp.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows only the configured couple account to access the private list", async () => {
    const caller = appRouter.createCaller(await createAuthorizedContext());
    await expect(caller.rsvp.list()).resolves.toEqual([]);
  });

  it("allows the configured couple account to archive a confirmation", async () => {
    const caller = appRouter.createCaller(await createAuthorizedContext());
    await expect(caller.rsvp.delete({ id: 42 })).resolves.toEqual({ success: true, id: 42 });
  });

  it("lists archived confirmations and restores one for the authorized account", async () => {
    const caller = appRouter.createCaller(await createAuthorizedContext());
    await expect(caller.rsvp.archived()).resolves.toEqual([]);
    await expect(caller.rsvp.restore({ id: 42 })).resolves.toEqual({ success: true, id: 42 });
  });

  it("blocks the private list for authenticated non-admin users", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 2,
      openId: "guest-user",
      name: "Guest User",
      email: "guest@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.rsvp.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
