export type ExportableRsvp = {
  guestName: string;
  status: "confirmed" | "declined";
  companions: number;
  phone: string | null;
  message: string | null;
  createdAt: Date | string | number;
};

function escapeCsvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function rsvpsToCsv(rows: ExportableRsvp[]) {
  const header = ["Convidado", "Status", "Acompanhantes", "WhatsApp", "Mensagem", "Data da resposta"];
  const lines = rows.map(row => [
    row.guestName,
    row.status === "confirmed" ? "Confirmado" : "Não poderá ir",
    String(row.status === "confirmed" ? row.companions : 0),
    row.phone ?? "",
    row.message ?? "",
    new Date(row.createdAt).toLocaleString("pt-BR"),
  ].map(value => escapeCsvCell(value)).join(";"));

  return [header.map(escapeCsvCell).join(";"), ...lines].join("\\r\\n");
}

export function removeRsvpFromList<T extends { id: number }>(rows: T[], id: number) {
  return rows.filter(row => row.id !== id);
}

export function prepareRsvpExport(rows: ExportableRsvp[], options: { filename?: string } = {}) {
  return {
    filename: options.filename ?? "lista-de-convidados-margarida-maycon.csv",
    mimeType: "text/csv;charset=utf-8",
    content: rsvpsToCsv(rows),
  } as const;
}

export function preparePanelExport(rows: ExportableRsvp[], options: { filename?: string } = {}) {
  return prepareRsvpExport(rows, options);
}

export function prepareArchivedPanelExport(rows: ExportableRsvp[]) {
  return preparePanelExport(rows, { filename: "confirmacoes-arquivadas-margarida-maycon.csv" });
}

export function preparePanelStateAfterDeletion<T extends ExportableRsvp & { id: number }>(rows: T[], deletedId: number) {
  const updatedRows = removeRsvpFromList(rows, deletedId);
  return { rows: updatedRows, export: preparePanelExport(updatedRows) } as const;
}

export type RsvpDownloadPort = {
  createBlob: (content: string, mimeType: string) => Blob;
  createObjectUrl: (blob: Blob) => string;
  revokeObjectUrl: (url: string) => void;
  createLink: () => { href: string; download: string; click: () => void };
};

export function downloadPreparedRsvpCsv(exported: ReturnType<typeof prepareRsvpExport>, port: RsvpDownloadPort) {
  const blob = port.createBlob(`\\uFEFF${exported.content}`, exported.mimeType);
  const url = port.createObjectUrl(blob);
  const link = port.createLink();
  link.href = url;
  link.download = exported.filename;
  link.click();
  port.revokeObjectUrl(url);
  return exported;
}

export function downloadRsvpCsv(rows: ExportableRsvp[], port: RsvpDownloadPort) {
  return downloadPreparedRsvpCsv(preparePanelExport(rows), port);
}
