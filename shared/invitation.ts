export const weddingDate = new Date("2026-12-19T15:00:00-03:00");
export const celebrationAddress = "Recanto Colonial, Guanambi, Bahia";
export const celebrationCoordinates = "-14.067742347717285,-42.90986633300781";
export const mayconWhatsApp = "5538999595533";
export const margaridaWhatsApp = "5511977557366";

export function isEnvelopeActivationKey(key: string) {
  return key === "Enter" || key === " " || key === "Spacebar";
}

export function canSubmitRsvp(guestName: string, attending: boolean | null) {
  return guestName.trim().length > 0 && attending !== null;
}

export function getTimeLeft(now = Date.now()) {
  const difference = Math.max(0, weddingDate.getTime() - now);
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
  };
}

export function getMapsUrl() {
  return "https://maps.google.com/maps/search/Recanto%20Colonial/@-14.067742347717285,-42.90986633300781,17z?hl=pt-BR";
}

export function getWazeUrl() {
  return `https://waze.com/ul?ll=${celebrationCoordinates}&navigate=yes`;
}

export function getCalendarEvent() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Margarida e Maycon//Convite de casamento//PT-BR",
    "BEGIN:VEVENT",
    "UID:margarida-maycon-20261219@convite",
    "DTSTAMP:20260826T000000Z",
    "DTSTART:20261219T180000Z",
    "DTEND:20261219T230000Z",
    "SUMMARY:Casamento Margarida & Maycon",
    "LOCATION:Recanto Colonial, Guanambi, Bahia",
    "DESCRIPTION:Com carinho, Margarida & Maycon. Cerimônia às 15h.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
