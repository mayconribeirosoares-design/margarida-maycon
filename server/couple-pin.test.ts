import { describe, expect, it } from "vitest";

describe("couple access PIN", () => {
  it("is configured as a private 4-to-6 digit value", () => {
    const pin = process.env.COUPLE_ACCESS_PIN;
    expect(pin).toBeDefined();
    expect(pin).toMatch(/^\d{4,6}$/);
  });
});
