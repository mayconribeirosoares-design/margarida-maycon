import { jwtVerify, SignJWT } from "jose";
import { ENV } from "./_core/env";

export const COUPLE_PIN_COOKIE = "couple_pin_verified";
const PIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

function secretKey() {
  return new TextEncoder().encode(ENV.cookieSecret);
}

export function isCouplePinValid(pin: string) {
  const configuredPin = process.env.COUPLE_ACCESS_PIN;
  return Boolean(configuredPin && pin === configuredPin);
}

export async function createCouplePinToken(openId: string) {
  return new SignJWT({ purpose: "couple-pin", openId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(openId)
    .setIssuedAt()
    .setExpirationTime(`${PIN_SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifyCouplePinToken(token: string | undefined, openId: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return payload.purpose === "couple-pin" && payload.sub === openId && payload.openId === openId;
  } catch {
    return false;
  }
}
