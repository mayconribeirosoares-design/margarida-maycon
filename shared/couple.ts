export const coupleDisplayName = "Margarida & Maycon";
export const coupleTextName = "Margarida e Maycon";

export function getAdminBrandLabel() {
  return coupleDisplayName;
}

export function buildCoupleConfirmationMessage(guests: number) {
  return `Confirmando presença no casamento de ${coupleDisplayName} em 19/12/2026, às 15h, no Recanto Colonial${guests > 1 ? ` (total de ${guests} pessoas, incluindo eu)` : ""}. Até lá!`;
}
