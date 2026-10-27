import { describe, expect, it } from "vitest";
import { canSubmitRsvp, getCalendarEvent, getMapsUrl, getTimeLeft, getWazeUrl, isEnvelopeActivationKey, weddingDate } from "../shared/invitation";

describe("invitation configuration", () => {
  it("recognizes keyboard activation for the envelope", () => {
    expect(isEnvelopeActivationKey("Enter")).toBe(true);
    expect(isEnvelopeActivationKey(" ")).toBe(true);
    expect(isEnvelopeActivationKey("Spacebar")).toBe(true);
    expect(isEnvelopeActivationKey("Escape")).toBe(false);
  });

  it("calculates days, hours and minutes until the celebration", () => {
    const reference = weddingDate.getTime() - (26 * 60 + 17) * 60 * 1000;
    expect(getTimeLeft(reference)).toEqual({ days: 1, hours: 2, minutes: 17 });
  });

  it("generates navigation links for the real venue", () => {
    expect(getMapsUrl()).toContain("Recanto%20Colonial");
    expect(getMapsUrl()).toContain("-14.067742347717285");
    expect(getWazeUrl()).toBe("https://waze.com/ul?ll=-14.067742347717285,-42.90986633300781&navigate=yes");
  });

  it("allows RSVP completion without WhatsApp or phone", () => {
    expect(canSubmitRsvp("Convidado sem WhatsApp", true)).toBe(true);
    expect(canSubmitRsvp("Convidado sem WhatsApp", false)).toBe(true);
    expect(canSubmitRsvp("", true)).toBe(false);
  });

  it("generates a calendar event with the official ceremony details", () => {
    const event = getCalendarEvent();
    expect(event).toContain("DTSTART:20261219T180000Z");
    expect(event).toContain("SUMMARY:Casamento Margarida & Maycon");
    expect(event).toContain("LOCATION:Recanto Colonial, Guanambi, Bahia");
    expect(event).toContain("DESCRIPTION:Com carinho, Margarida & Maycon. Cerimônia às 15h.");
  });
});
