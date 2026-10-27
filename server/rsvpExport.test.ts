import { describe, expect, it } from "vitest";
import { downloadPreparedRsvpCsv, downloadRsvpCsv, prepareArchivedPanelExport, preparePanelExport, preparePanelStateAfterDeletion, prepareRsvpExport, removeRsvpFromList, rsvpsToCsv } from "../shared/rsvpExport";

describe("rsvpsToCsv", () => {
  it("exports the guest list with headers and escaped content", () => {
    const csv = rsvpsToCsv([{
      guestName: "Ana; Souza",
      status: "confirmed",
      companions: 1,
      phone: null,
      message: "Vamos!",
      createdAt: "2026-08-26T12:00:00.000Z",
    }]);

    expect(csv).toContain('"Convidado";"Status";"Acompanhantes"');
    expect(csv).toContain('"Ana; Souza";"Confirmado";"1";"";"Vamos!"');

    const exported = prepareRsvpExport([]);
    expect(exported.filename).toBe("lista-de-convidados-margarida-maycon.csv");
    expect(exported.mimeType).toBe("text/csv;charset=utf-8");
    expect(exported.content).toContain("Convidado");
  });

  it("exports the current list after a confirmation is removed", () => {
    const rows = [
      { id: 1, guestName: "Ana", status: "confirmed" as const, companions: 0, phone: null, message: null, createdAt: 0 },
      { id: 2, guestName: "Bruno", status: "declined" as const, companions: 0, phone: null, message: null, createdAt: 0 },
    ];
    const remainingRows = removeRsvpFromList(rows, 2);
    const csv = rsvpsToCsv(remainingRows);
    expect(csv).toContain('"Ana"');
    expect(csv).not.toContain('"Bruno"');
  });

  it("updates the panel cache before exporting after deletion", async () => {
    const cache = [
      { id: 7, guestName: "Carla", status: "confirmed" as const, companions: 0, phone: null, message: null, createdAt: 0 },
      { id: 8, guestName: "Diego", status: "declined" as const, companions: 0, phone: null, message: null, createdAt: 0 },
    ];
    const deletionResult = await Promise.resolve({ id: 8 });
    const panelState = preparePanelStateAfterDeletion(cache, deletionResult.id);
    expect(panelState.rows).toHaveLength(1);
    expect(panelState.export.content).toContain('"Carla"');
    expect(panelState.export.content).not.toContain('"Diego"');
    let clicked = false;
    const link = { href: "", download: "", click: () => { clicked = true; } };
    const downloaded = downloadPreparedRsvpCsv(preparePanelExport(panelState.rows), {
      createBlob: (content, mimeType) => ({ content, mimeType } as unknown as Blob),
      createObjectUrl: () => "blob:updated-list",
      revokeObjectUrl: () => undefined,
      createLink: () => link,
    });
    expect(clicked).toBe(true);
    expect(link.download).toBe("lista-de-convidados-margarida-maycon.csv");
    expect(downloaded.content).toBe(panelState.export.content);
    expect(downloaded.content).not.toContain('"Diego"');
  });

  it("exports archived confirmations separately with the archived filename", () => {
    const archived = [{ id: 9, guestName: "Elisa", status: "confirmed" as const, companions: 2, phone: "999", message: "Arquivada", createdAt: 0, archivedAt: 1000 }];
    const exported = prepareRsvpExport(archived, { filename: "confirmacoes-arquivadas-margarida-maycon.csv" });
    expect(exported.filename).toBe("confirmacoes-arquivadas-margarida-maycon.csv");
    expect(exported.content).toContain('"Elisa"');
    expect(exported.content).toContain('"Arquivada"');
  });

  it("uses the real archived panel export flow and triggers its download", () => {
    let clicked = false;
    const link = { href: "", download: "", click: () => { clicked = true; } };
    const exported = prepareArchivedPanelExport([{ guestName: "Elisa", status: "confirmed", companions: 0, phone: null, message: null, createdAt: 0 }]);
    const downloaded = downloadPreparedRsvpCsv(exported, {
      createBlob: (content, mimeType) => ({ content, mimeType } as unknown as Blob),
      createObjectUrl: () => "blob:archived-list",
      revokeObjectUrl: () => undefined,
      createLink: () => link,
    });
    expect(exported.filename).toBe("confirmacoes-arquivadas-margarida-maycon.csv");
    expect(exported.content).toContain('"Elisa"');
    expect(downloaded.filename).toBe(exported.filename);
    expect(link.download).toBe(exported.filename);
    expect(clicked).toBe(true);
  });

  it("builds and triggers the CSV download lifecycle", () => {
    const events: string[] = [];
    const link = { href: "", download: "", click: () => events.push("click") };
    const exported = downloadRsvpCsv([], {
      createBlob: (content, mimeType) => ({ content, mimeType } as unknown as Blob),
      createObjectUrl: blob => { events.push(`url:${(blob as unknown as { mimeType: string }).mimeType}`); return "blob:guest-list"; },
      revokeObjectUrl: url => events.push(`revoke:${url}`),
      createLink: () => link,
    });

    expect(link.href).toBe("blob:guest-list");
    expect(link.download).toBe(exported.filename);
    expect(events).toEqual(["url:text/csv;charset=utf-8", "click", "revoke:blob:guest-list"]);
  });
});
