import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Gift } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { GiftCategory } from "@shared/gifts";

const categories: GiftCategory[] = ["Eletros & rotina", "Casa & cozinha", "Mesa & servir", "Quarto & banho", "Casa & organização", "Cotas"];

export default function Gifts() {
  const gifts = trpc.gifts.list.useQuery();
  const [selectedGift, setSelectedGift] = useState<{ slug: string; title: string } | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const reserveGift = trpc.gifts.reserve.useMutation({
    onSuccess: async () => {
      toast.success("Presente reservado com carinho. Obrigado!");
      setSelectedGift(null);
      setName("");
      setPhone("");
      await gifts.refetch();
    },
    onError: (error) => toast.error(error.message || "Esse presente acabou de ser reservado. Escolha outro da lista."),
  });

  const availableByCategory = useMemo(() => (gifts.data ?? []).filter((gift) => !gift.reservedAt).reduce<Record<string, typeof gifts.data>>((groups, gift) => {
    (groups[gift.category] ??= []).push(gift);
    return groups;
  }, {}), [gifts.data]);

  function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGift) return;
    reserveGift.mutate({ slug: selectedGift.slug, reservedBy: name.trim(), reservedPhone: phone.trim() || undefined });
  }

  return <main className="gifts-page"><header className="gifts-header"><Link href="/" className="gifts-back"><ArrowLeft size={15} /> Voltar ao convite</Link><div className="section-ornament"><span /><Gift size={17} /><span /></div><div className="sketch-label">Margarida &amp; Maycon</div><h1>Lista de presentes</h1><p>Esta é uma lista de sugestões para a nossa casa. Escolha com carinho o que sentir e, ao reservar, o item fica indisponível para os próximos convidados.</p></header><section className="gifts-content">{gifts.isLoading ? <div className="gift-loading">Carregando nossa lista...</div> : categories.map((category) => { const items = availableByCategory[category] ?? []; return items.length ? <section className="gift-category" key={category}><h2>{category}</h2><div className="gift-grid">{items.map((gift) => <article className="gift-card" key={gift.slug}><Gift size={17} /><div><h3>{gift.title}</h3><p>{gift.description}</p><button type="button" className="gift-select-button" onClick={() => setSelectedGift({ slug: gift.slug, title: gift.title })}>Escolher este presente</button></div></article>)}</div></section> : null; })}{!gifts.isLoading && gifts.data?.every((gift) => gift.reservedAt) && <div className="gift-empty">Todos os presentes já foram escolhidos. Obrigado por tanto carinho!</div>}<p className="gift-list-note">Podem dar o que sentirem. A lista traz apenas algumas sugestões de presentes que precisamos.</p></section><footer className="gifts-footer"><Link href="/">Margarida &amp; Maycon · Nosso casamento</Link><Link href="/admin" className="gifts-admin-link">Área dos noivos <small>acesso exclusivo</small></Link></footer>{selectedGift && <div className="gift-reservation-backdrop" role="presentation" onClick={() => setSelectedGift(null)}><form className="gift-reservation-card" onSubmit={submitReservation} onClick={(event) => event.stopPropagation()}><button className="gift-close" type="button" onClick={() => setSelectedGift(null)} aria-label="Fechar reserva">×</button><span className="sketch-label">Reservar presente</span><h3>{selectedGift.title}</h3><p>Informe seu nome para que os noivos saibam quem escolheu este carinho. O WhatsApp é opcional.</p><label htmlFor="gift-name">Seu nome<input id="gift-name" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} placeholder="Digite seu nome completo" /></label><label htmlFor="gift-phone">WhatsApp <span>(opcional)</span><input id="gift-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(00) 00000-0000" /></label><button className="sketch-cta primary" type="submit" disabled={reserveGift.isPending}>{reserveGift.isPending ? "Reservando..." : "Confirmar escolha"}</button></form></div>}</main>;
}
