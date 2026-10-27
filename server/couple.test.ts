import { describe, expect, it } from "vitest";
import { buildCoupleConfirmationMessage, coupleDisplayName, coupleTextName, getAdminBrandLabel } from "../shared/couple";

describe("couple naming", () => {
  it("keeps the official display order everywhere", () => {
    expect(coupleDisplayName).toBe("Margarida & Maycon");
    expect(coupleTextName).toBe("Margarida e Maycon");
  });

  it("builds the RSVP/WhatsApp confirmation with Margarida first", () => {
    const message = buildCoupleConfirmationMessage(2);
    expect(message).toContain("casamento de Margarida & Maycon");
    expect(message).not.toContain("Maycon & Margarida");
  });

  it("keeps the administrative header label in the official order", () => {
    expect(getAdminBrandLabel()).toBe("Margarida & Maycon");
  });
});
