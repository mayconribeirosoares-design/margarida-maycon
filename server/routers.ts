import { z } from "zod";
import { parse as parseCookieHeader } from "cookie";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { archiveRsvp, createRsvp, listArchivedRsvps, listGiftItems, listRsvps, releaseGiftItem, reserveGiftItem, restoreRsvp } from "./db";
import { COUPLE_PIN_COOKIE, createCouplePinToken, isCouplePinValid, verifyCouplePinToken } from "./couplePin";
import type { TrpcContext } from "./_core/context";

function isCoupleAccount(user: TrpcContext["user"]) {
  const secondIdentifier = process.env.COUPLE_SECOND_EMAIL;
  return Boolean(user && secondIdentifier && (user.email?.trim().toLowerCase() === secondIdentifier.trim().toLowerCase() || user.openId === secondIdentifier));
}

function isConfiguredCoupleEmail(email: string) {
  const configuredEmail = process.env.COUPLE_SECOND_EMAIL;
  return Boolean(configuredEmail && email.trim().toLowerCase() === configuredEmail.trim().toLowerCase());
}

async function hasVerifiedPin(req: TrpcContext["req"], openId: string) {
  const cookies = parseCookieHeader(req.headers.cookie ?? "");
  return verifyCouplePinToken(cookies[COUPLE_PIN_COOKIE], openId);
}

const coupleOnlyProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const authorizedSession = await hasVerifiedPin(ctx.req, process.env.COUPLE_SECOND_EMAIL || "");
  const oauthSession = Boolean(ctx.user && isCoupleAccount(ctx.user) && await hasVerifiedPin(ctx.req, ctx.user.openId));
  if (!authorizedSession && !oauthSession) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso exclusivo aos noivos." });
  }
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  rsvp: router({
    access: publicProcedure.query(async ({ ctx }) => {
      const coupleAllowed = isCoupleAccount(ctx.user);
      const pinVerified = Boolean((ctx.user && coupleAllowed && (await hasVerifiedPin(ctx.req, ctx.user.openId))) || (await hasVerifiedPin(ctx.req, process.env.COUPLE_SECOND_EMAIL || "")));
      return { coupleAllowed, pinVerified } as const;
    }),
    loginWithCredentials: publicProcedure
      .input(z.object({ email: z.string().trim().email(), pin: z.string().trim().regex(/^\d{4,6}$/) }))
      .mutation(async ({ ctx, input }) => {
        if (!isConfiguredCoupleEmail(input.email)) throw new TRPCError({ code: "FORBIDDEN", message: "E-mail não autorizado." });
        if (!isCouplePinValid(input.pin)) throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorreto." });
        const token = await createCouplePinToken(process.env.COUPLE_SECOND_EMAIL || input.email.trim().toLowerCase());
        ctx.res.cookie(COUPLE_PIN_COOKIE, token, { ...getSessionCookieOptions(ctx.req), maxAge: 12 * 60 * 60 * 1000 });
        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COUPLE_PIN_COOKIE, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
    verifyPin: publicProcedure
      .input(z.object({ pin: z.string().trim().regex(/^\d{4,6}$/) }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || !isCoupleAccount(ctx.user)) throw new TRPCError({ code: "FORBIDDEN", message: "Acesso exclusivo aos noivos." });
        if (!isCouplePinValid(input.pin)) throw new TRPCError({ code: "UNAUTHORIZED", message: "PIN incorreto." });
        const token = await createCouplePinToken(ctx.user.openId);
        ctx.res.cookie(COUPLE_PIN_COOKIE, token, { ...getSessionCookieOptions(ctx.req), maxAge: 12 * 60 * 60 * 1000 });
        return { success: true } as const;
      }),
    submit: publicProcedure
      .input(z.object({
        guestName: z.string().trim().min(2).max(160),
        phone: z.string().trim().max(32).optional(),
        status: z.enum(["confirmed", "declined"]),
        companions: z.number().int().min(0).max(10).default(0),
        message: z.string().trim().max(1000).optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createRsvp({
          guestName: input.guestName,
          phone: input.phone || null,
          status: input.status,
          companions: input.companions,
          message: input.message || null,
        });
        return { success: true, id: result.id } as const;
      }),
    list: coupleOnlyProcedure.query(async () => listRsvps()),
    archived: coupleOnlyProcedure.query(async () => listArchivedRsvps()),
    delete: coupleOnlyProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await archiveRsvp(input.id);
        return { success: true, id: input.id } as const;
      }),
    restore: coupleOnlyProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await restoreRsvp(input.id);
        return { success: true, id: input.id } as const;
    }),
  }),
  gifts: router({
    list: publicProcedure.query(async () => listGiftItems()),
    reserve: publicProcedure
      .input(z.object({ slug: z.string().trim().min(1).max(120), reservedBy: z.string().trim().min(2).max(160), reservedPhone: z.string().trim().max(32).optional() }))
      .mutation(async ({ input }) => {
        const result = await reserveGiftItem(input.slug, input.reservedBy, input.reservedPhone || null);
        if (!result.reserved) throw new TRPCError({ code: "CONFLICT", message: "Este presente acabou de ser reservado por outra pessoa." });
        return { success: true as const };
      }),
    adminList: coupleOnlyProcedure.query(async () => listGiftItems()),
    release: coupleOnlyProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await releaseGiftItem(input.id);
        return { success: true as const, id: input.id };
      }),
  }),
});

export type AppRouter = typeof appRouter;
