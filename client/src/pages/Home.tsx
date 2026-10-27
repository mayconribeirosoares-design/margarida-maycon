import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  Heart,
  MapPin,
  Navigation,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  canSubmitRsvp,
  getMapsUrl,
  getTimeLeft,
  getWazeUrl,
  getCalendarEvent,
  isEnvelopeActivationKey,
  margaridaWhatsApp,
  mayconWhatsApp,
} from "@shared/invitation";
import { buildCoupleConfirmationMessage } from "@shared/couple";

const couplePhoto = "/manus-storage/async-images/JSKccCo0kG3YzODFGJoEr7/image-1.webp";
const galleryPhotos = [
  { src: "/manus-storage/async-images/JSKccCo0kG3YzODFGJoEr7/image-2.webp", alt: "Jardim iluminado com flores e folhagens" },
  { src: "/manus-storage/async-images/JSKccCo0kG3YzODFGJoEr7/image-3.webp", alt: "Taças e detalhes delicados da celebração" },
  { src: "/manus-storage/async-images/JSKccCo0kG3YzODFGJoEr7/image-4.webp", alt: "Mãos entrelaçadas ao lado de flores no pôr do sol" },
  { src: "/manus-storage/async-images/JSKccCo0kG3YzODFGJoEr7/image-1.webp", alt: "Margarida e Maycon em um jardim ensolarado" },
];
const petals = Array.from({ length: 18 }, (_, index) => index);
export default function Home() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(() => window.location.hash === "#opened");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft());
  const submitRsvp = trpc.rsvp.submit.useMutation({
    onSuccess: () => toast.success("Sua confirmação foi registrada com carinho."),
    onError: () => toast.error("Não foi possível registrar agora. Tente novamente."),
  });

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const mapsUrl = getMapsUrl();
  const wazeUrl = getWazeUrl();
  const whatsappBase = useMemo(() => `Olá! Aqui é ${guestName.trim()}. `, [guestName]);

  function buildMessage() {
    if (attending) return `${whatsappBase}${buildCoupleConfirmationMessage(guests)}`;
    return `${whatsappBase}Infelizmente não poderei comparecer ao casamento de vocês em 19/12/2026. Desejo toda felicidade a vocês dois!`;
  }

  function sendWhatsApp(number: string) {
    if (!guestName.trim() || attending === null) return;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener,noreferrer");
  }

  function saveToCalendar() {
    const blob = new Blob([getCalendarEvent()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "casamento-margarida-maycon.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (attending === null) return;
    submitRsvp.mutate({
      guestName: guestName.trim(),
      phone: phone.trim() || undefined,
      status: attending ? "confirmed" : "declined",
      companions: attending ? guests - 1 : 0,
      message: message.trim() || undefined,
    });
  }

  return (
    <main className={`sketch-page ${isEnvelopeOpen ? "is-open" : "is-closed"}`}>
      {!isEnvelopeOpen && (
        <section className="envelope-screen" aria-label="Abertura do convite">
          <div className="envelope-glow" />
          <div className="envelope-kicker">Um convite especial para você</div>
          <button
            className="envelope-button"
            type="button"
            onClick={() => setIsEnvelopeOpen(true)}
            onKeyDown={(event) => {
              if (isEnvelopeActivationKey(event.key)) setIsEnvelopeOpen(true);
            }}
            aria-label="Abrir o convite de Margarida e Maycon"
          >
            <div className="envelope-paper">
              <span className="envelope-paper-line" />
              <span className="envelope-monogram">M <i>&amp;</i> M</span>
              <span className="envelope-paper-caption">Nosso casamento</span>
            </div>
            <div className="envelope-flap" />
            <div className="envelope-pocket" />
            <span className="envelope-seal"><span className="seal-inner"><strong>M <i>&amp;</i> M</strong><small>MARGARIDA · MAYCON</small></span></span>
          </button>
          <p className="envelope-hint">Toque no buquê para abrir</p>
        </section>
      )}

      {isEnvelopeOpen && (
        <div className="petal-field" aria-hidden="true">
          {petals.map((petal, index) => (
            <span key={petal} className={`petal petal-${index % 5}`} style={{ left: `${4 + (index * 11) % 94}%`, animationDelay: `${index * 0.42}s`, animationDuration: `${8 + (index % 5)}s` }} />
          ))}
        </div>
      )}

      <div className="sketch-wrap">
        <section className="sketch-hero">
          <div className="sketch-eyebrow">Com alegria, convidamos você</div>
          <div className="sketch-arch">
            <img src={couplePhoto} alt="Margarida e Maycon" />
            <div className="sketch-caption"><span>Margarida <i>&amp;</i> Maycon</span><strong>Nosso casamento</strong></div>
          </div>
          <div className="sketch-date"><span />19 de dezembro de 2026<span /></div>
          <p className="sketch-intro">Depois de tudo o que vivemos, chegou a hora de celebrar. Gostaríamos muito da sua presença para dizer <em>sim</em> diante de quem amamos.</p>
          <div className="countdown-sketch" aria-label="Contagem regressiva"><div><strong>{timeLeft.days}</strong><small>dias</small></div><i /><div><strong>{String(timeLeft.hours).padStart(2, "0")}</strong><small>horas</small></div><i /><div><strong>{String(timeLeft.minutes).padStart(2, "0")}</strong><small>minutos</small></div></div>
          <Link href="/admin" className="hero-admin-link"><Heart size={13} /> Área dos noivos</Link>
        </section>

        <div className="sketch-divider"><span /><b /><span /></div>

        <section className="sketch-details">
          <div className="sketch-detail-card"><CalendarDays className="sketch-icon" /><div className="sketch-label">Data e horário</div><div className="sketch-main">Sábado, 19 de dezembro</div><div className="sketch-sub">Cerimônia às 15h</div><button type="button" className="calendar-button" onClick={saveToCalendar}><CalendarPlus size={14} /> Salvar no calendário</button></div>
          <div className="sketch-detail-card"><MapPin className="sketch-icon" /><div className="sketch-label">Local</div><div className="sketch-main">Recanto Colonial</div><div className="sketch-sub">Guanambi, Bahia</div><div className="route-actions-sketch"><a href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={14} /> Google Maps</a><a href={wazeUrl} target="_blank" rel="noreferrer"><Navigation size={14} /> Waze</a></div><small className="route-caption">Abra para criar seu trajeto</small></div>
        </section>

        <section className="gift-access-card" aria-labelledby="gifts-access-title"><div className="section-ornament"><span /><span className="gift-access-mark">✦</span><span /></div><div className="sketch-label">Com carinho, se desejar</div><h2 id="gifts-access-title">Lista de presentes</h2><p>Sua presença é o nosso maior presente. Se quiser nos presentear, preparamos uma lista organizada para a nossa casa e para a lua de mel.</p><Link className="gift-access-button" href="/presentes">Acessar lista de presentes <span>→</span></Link></section>

        <section className="photo-gallery-sketch" aria-labelledby="gallery-title"><div className="sketch-label">Alguns capítulos da nossa história</div><h2 id="gallery-title">Momentos que guardamos</h2><p className="gallery-intro">Cada foto carrega um pedacinho do caminho que nos trouxe até aqui.</p><div className="gallery-grid-sketch">{galleryPhotos.map((photo, index) => <figure key={photo.src} className={`gallery-photo gallery-photo-${index + 1}`}><img src={photo.src} alt={photo.alt} loading="lazy" /></figure>)}</div></section>

        <section className="sketch-rsvp" id="rsvp"><h2>Confirmar presença</h2><p className="rsvp-sub">Preencha os campos abaixo. Sua presença será registrada diretamente neste convite. Se quiser, você também pode avisar os noivos pelo WhatsApp.</p><form onSubmit={handleSubmit}><div className="sketch-field"><label htmlFor="nome">Seu nome</label><input id="nome" required value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Digite seu nome completo" /></div><div className="sketch-field"><label>Você vai comparecer?</label><div className="choice-row-sketch"><button type="button" className={attending === true ? "choice-sketch active-yes" : "choice-sketch"} onClick={() => setAttending(true)}>Sim, vou!</button><button type="button" className={attending === false ? "choice-sketch active-no" : "choice-sketch"} onClick={() => setAttending(false)}>Não poderei ir</button></div></div>{attending === true && <div className="guests-row-sketch"><label htmlFor="guests">Total de pessoas</label><div className="stepper-sketch"><button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}>−</button><span>{guests}</span><button type="button" onClick={() => setGuests(Math.min(10, guests + 1))}>+</button></div></div>}<div className="sketch-field"><label htmlFor="phone">WhatsApp <span>(opcional)</span></label><input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" /></div><div className="sketch-field"><label htmlFor="message">Uma mensagem <span>(opcional)</span></label><textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Deixe um carinho para os noivos" rows={2} /></div><p className="send-note-sketch">Sua resposta será registrada no site. O envio pelo WhatsApp é opcional e fica a seu critério.</p><button className="sketch-cta primary" type="submit" disabled={submitRsvp.isPending || !canSubmitRsvp(guestName, attending)}>{submitRsvp.isPending ? "Registrando..." : "Registrar confirmação"}<Send size={15} /></button><div className="whatsapp-optional-label">Se desejar, avise também por WhatsApp</div><div className="whatsapp-buttons"><button className="sketch-cta whatsapp" type="button" disabled={!canSubmitRsvp(guestName, attending)} onClick={() => sendWhatsApp(margaridaWhatsApp)}>Enviar para Margarida</button><button className="sketch-cta secondary" type="button" disabled={!canSubmitRsvp(guestName, attending)} onClick={() => sendWhatsApp(mayconWhatsApp)}>Enviar para Maycon</button></div></form></section>

        <footer className="sketch-footer"><div className="sketch-sig">Com carinho, Margarida &amp; Maycon</div><div className="sketch-contacts"><b>Margarida Cotrim</b> — (11) 97755-7366<br /><b>Maycon Ribeiro</b> — (38) 99959-5533</div><a className="couple-area" href="/admin"><Heart size={13} /> Área dos noivos</a><small className="couple-area-note">Acesso exclusivo do casal · login + PIN</small></footer>
      </div>
    </main>
  );
}
