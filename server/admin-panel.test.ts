import { describe, expect, it } from "vitest";
import { getAdminAccessState, getAdminPanelView } from "../shared/adminAccess";
import { prepareRsvpExport } from "../shared/rsvpExport";

describe("admin panel behavior", () => {
  it("distinguishes visitor, non-admin, external admin and couple access", () => {
    expect(getAdminAccessState(null)).toBe("unauthenticated");
    expect(getAdminAccessState({ role: "user" })).toBe("forbidden");
    expect(getAdminAccessState({ role: "admin" })).toBe("forbidden");
    expect(getAdminAccessState({ role: "admin" }, true)).toBe("allowed");
    expect(getAdminAccessState({ role: "admin" }, false)).toBe("forbidden");
    expect(getAdminPanelView(null, false)).toBe("login");
    expect(getAdminPanelView({ role: "admin" }, false)).toBe("restricted");
    expect(getAdminPanelView({ role: "admin" }, true)).toBe("panel");
  });

  it("prepares the exact downloadable CSV specification", () => {
    const exported = prepareRsvpExport([{
      guestName: "Margarida",
      status: "confirmed",
      companions: 0,
      phone: null,
      message: null,
      createdAt: 0,
    }]);
    expect(exported.filename).toBe("lista-de-convidados-margarida-maycon.csv");
    expect(exported.mimeType).toBe("text/csv;charset=utf-8");
    expect(exported.content).toContain('"Margarida";"Confirmado";"0"');
  });
});
