import { describe, expect, it } from "vitest";

describe("couple access secret", () => {
  it("exposes a configured second couple account identifier", () => {
    const secondAccountIdentifier = process.env.COUPLE_SECOND_EMAIL;
    expect(secondAccountIdentifier).toBeTruthy();
    expect(secondAccountIdentifier).toMatch(/^\S+$/);
  });
});
