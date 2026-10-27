import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { Archive, ArrowLeft, Check, Clock3, Download, Gift, LogOut, MessageCircle, RotateCcw, Trash2, Users, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { downloadPreparedRsvpCsv, prepareArchivedPanelExport, preparePanelExport, preparePanelStateAfterDeletion } from "@shared/rsvpExport";
import { getAdminPanelView } from "@shared/adminAccess";

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const utils = trpc.useUtils();
  const access = trpc.rsvp.access.useQuery();
  const verifyPin = trpc.rsvp.verifyPin.useMutation({
    onSuccess: () => { setPin(""); toast.success("Acesso liberado."); void access.refetch(); },
    onError: () => toast.error("PIN incorreto. Tente novamente."),
  });
  const loginWithCredentials = trpc.rsvp.loginWithCredentials.useMutation({
    onSuccess: () => { setEmail(""); setPin(""); toast.success("Acesso liberado."); void access.refetch(); },
    onError: (error) => toast.error(error.message || "E-mail ou PIN inválido."),
  });
  const rsvps = trpc.rsvp.list.useQuery(undefined, { enabled: access.data?.pinVerified === true });
  const archivedRsvps = trpc.rsvp.archived.useQuery(undefined, { enabled: access.data?.pinVerified === true });
  const gifts = trpc.gifts.adminList.useQuery(undefined, { enabled: access.data?.pinVerified === true });
  const deleteRsvp = trpc.rsvp.delete.useMutation({
    onSuccess: (_result, variables) => { toast.success("Confirmação arquivada. Ela pode ser restaurada."); utils.rsvp.list.setData(undefined, rows => rows ? preparePanelStateAfterDeletion(rows, variables.id).rows : rows); void utils.rsvp.list.invalidate(); void utils.rsvp.archived.invalidate(); },
    onError: () => toast.error("Não foi possível arquivar esta confirmação."),
  });
  const restoreRsvp = trpc.rsvp.restore.useMutation({
    onSuccess: () => { toast.success("Confirmação restaurada."); void utils.rsvp.list.invalidate(); void utils.rsvp.archived.invalidate(); },
    onError: () => toast.error("Não foi possível restaurar esta confirmação."),
  });
  const releaseGift = trpc.gifts.release.useMutation({
    onSuccess: () => { toast.success("Presente liberado para a lista novamente."); void gifts.refetch(); },
    onError: () => toast.error("Não foi possível liberar este presente."),
  });
  const stats = useMemo(() => {
    const rows = rsvps.data ?? [];
    return {
      total: rows.length,
      confirmed: rows.filter(row => row.status === "confirmed").length,
      declined: rows.filter(row => row.status === "declined").length,
      people: rows.reduce((sum, row) => sum + 1 + (row.status === "confirmed" ? row.companions : 0), 0),
    };
  }, [rsvps.data]);
  const archivedRows = archivedRsvps.data ?? [];
  const latestUpdatedAt = [...(rsvps.data ?? []), ...archivedRows].map(row => new Date(row.updatedAt).getTime()).filter(Number.isFinite).sort((a, b) => b - a)[0];

  if (loading) return <div className="admin-state">Carregando sua área...</div>;
  if (!access.isLoading && access.data?.pinVerified !== true) return <div className="admin-state"><div><span className="eyebrow">Área reservada</span><h1>Somente os noivos</h1><p>Informe o e-mail autorizado e o PIN privado para visualizar as confirmações e controlar a lista de presentes.</p><form className="pin-form" onSubmit={event => { event.preventDefault(); loginWithCredentials.mutate({ email, pin }); }}><input value={email} onChange={event => setEmail(event.target.value)} type="email" autoComplete="email" aria-label="E-mail autorizado" placeholder="E-mail dos noivos" required /><input className="pin-input" value={pin} onChange={event => setPin(event.target.value)} inputMode="numeric" pattern="[0-9]{4,6}" minLength={4} maxLength={6} autoComplete="current-password" aria-label="PIN dos noivos" placeholder="PIN de 4 a 6 dígitos" required /><Button type="submit" disabled={loginWithCredentials.isPending || !email.trim() || !/^\d{4,6}$/.test(pin)}>{loginWithCredentials.isPending ? "Entrando..." : "Entrar no portal"}</Button></form><Link href="/" className="back-link">Voltar ao convite</Link></div></div>;
  const panelView = getAdminPanelView(user, access.data?.coupleAllowed === true, access.isLoading);
  if (panelView === "login") return <div className="admin-state"><div><span className="eyebrow">Área reservada</span><h1>Somente os noivos</h1><p>Entre com sua conta para visualizar as confirmações.</p><Button onClick={() => startLogin()}>Entrar com segurança</Button><Link href="/" className="back-link">Voltar ao convite</Link></div></div>;
  if (panelView === "loading") return <div className="admin-state">Verificando acesso...</div>;
  if (panelView === "restricted") return <div className="admin-state"><div><span className="eyebrow">Acesso restrito</span><h1>Esta área é do casal</h1><p>Sua conta não possui permissão para visualizar as confirmações.</p><Link href="/" className="back-link">Voltar ao convite</Link></div></div>;
  if (access.data?.pinVerified !== true) return <div className="admin-state"><div><span className="eyebrow">Segundo acesso</span><h1>Digite o PIN dos noivos</h1><p>Este código adicional protege as confirmações de Margarida e Maycon.</p><form className="pin-form" onSubmit={event => { event.preventDefault(); verifyPin.mutate({ pin }); }}><input className="pin-input" value={pin} onChange={event => setPin(event.target.value)} inputMode="numeric" pattern="[0-9]{4,6}" minLength={4} maxLength={6} autoComplete="one-time-code" aria-label="PIN dos noivos" placeholder="Digite seu PIN" /><Button type="submit" disabled={verifyPin.isPending || !/^\d{4,6}$/.test(pin)}>{verifyPin.isPending ? "Verificando..." : "Entrar no portal"}</Button></form><Link href="/" className="back-link">Voltar ao convite</Link></div></div>;

  function removeRsvp(id: number, guestName: string) {
    if (window.confirm(`Arquivar a confirmação de ${guestName}? Ela poderá ser restaurada depois.`)) {
      deleteRsvp.mutate({ id });
    }
  }

  function restoreArchivedRsvp(id: number, guestName: string) {
    if (window.confirm(`Restaurar a confirmação de ${guestName}?`)) restoreRsvp.mutate({ id });
  }

  function exportGuestList() {
    downloadPreparedRsvpCsv(preparePanelExport(rsvps.data ?? []), {
      createBlob: (content, mimeType) => new Blob([content], { type: mimeType }),
      createObjectUrl: blob => URL.createObjectURL(blob),
      revokeObjectUrl: url => URL.revokeObjectURL(url),
      createLink: () => document.createElement("a"),
    });
  }

  function exportArchivedList() {
    downloadPreparedRsvpCsv(prepareArchivedPanelExport(archivedRsvps.data ?? []), {
      createBlob: (content, mimeType) => new Blob([content], { type: mimeType }),
      createObjectUrl: blob => URL.createObjectURL(blob),
      revokeObjectUrl: url => URL.revokeObjectURL(url),
      createLink: () => document.createElement("a"),
    });
  }

  function releaseReservedGift(id: number, title: string) {
    if (window.confirm(`Liberar “${title}” para que outra pessoa possa escolhê-lo?`)) releaseGift.mutate({ id });
  }

  return <DashboardLayout><div className="admin-page"><header className="admin-header"><div><Link href="/" className="back-link"><ArrowLeft size={15} /> Voltar ao convite</Link><span className="eyebrow">Painel dos noivos</span><h1>Confirmações <em>de presença</em></h1></div><div className="admin-header-actions"><button className="export-button" onClick={exportGuestList} disabled={rsvps.isLoading || !rsvps.data?.length}><Download size={15} /> Exportar lista</button><button className="archive-toggle" type="button" onClick={() => setShowArchived(value => !value)}><Archive size={15} /> Arquivados ({archivedRows.length})</button><button className="logout-button" onClick={logout}><LogOut size={15} /> Sair</button></div></header><main className="admin-content"><div className="confirmed-summary"><div><span className="section-kicker">Presenças confirmadas</span><strong>{stats.confirmed}</strong><p>respostas afirmativas recebidas{latestUpdatedAt ? ` · atualização ${new Date(latestUpdatedAt).toLocaleString("pt-BR")}` : ""}</p></div><Check size={29} /></div><div className="stats-grid"><div className="stat-card"><span><Users size={17} /></span><strong>{stats.total}</strong><small>respostas recebidas</small></div><div className="stat-card"><span className="green"><Check size={17} /></span><strong>{stats.confirmed}</strong><small>confirmados</small></div><div className="stat-card"><span className="rose"><X size={17} /></span><strong>{stats.declined}</strong><small>não poderão ir</small></div><div className="stat-card"><span className="gold"><Users size={17} /></span><strong>{stats.people}</strong><small>pessoas esperadas</small></div></div><section className="responses-card"><div className="responses-heading"><div><span className="section-kicker">Lista atualizada</span><h2>Quem estará com vocês</h2></div><span className="live-indicator"><span /> Dados ao vivo</span></div>{rsvps.isLoading ? <div className="empty-state">Carregando confirmações...</div> : rsvps.isError ? <div className="empty-state"><X size={22} /><p>Não foi possível carregar as confirmações agora.<br />Atualize a página e tente novamente.</p><Button onClick={() => rsvps.refetch()} variant="outline">Tentar novamente</Button></div> : rsvps.data?.length === 0 ? <div className="empty-state"><Clock3 size={22} /><p>Ainda não recebemos confirmações.<br />Compartilhe o convite para começar.</p></div> : <div className="responses-table"><div className="table-head"><span>Convidado</span><span>Status</span><span>Companhia</span><span>Data</span><span>Mensagem</span><span>Ação</span></div>{rsvps.data?.map(row => <div className="table-row" key={row.id}><div><strong>{row.guestName}</strong>{row.phone && <small>{row.phone}</small>}</div><span className={`status-pill ${row.status}`}><span />{row.status === "confirmed" ? "Confirmado" : "Não poderá ir"}</span><span>{row.status === "confirmed" ? row.companions === 0 ? "Somente convidado" : `+ ${row.companions} pessoa${row.companions > 1 ? "s" : ""}` : "—"}</span><span>{new Date(row.createdAt).toLocaleDateString("pt-BR")}</span><span className="message-cell">{row.message ? <><MessageCircle size={13} /> {row.message}</> : "—"}</span><button className="delete-rsvp-button" type="button" aria-label={`Excluir confirmação de ${row.guestName}`} title="Excluir confirmação" disabled={deleteRsvp.isPending} onClick={() => removeRsvp(row.id, row.guestName)}><Trash2 size={15} /></button></div>)}</div>}</section>{showArchived && <section className="responses-card archived-card"><div className="responses-heading"><div><span className="section-kicker">Histórico protegido</span><h2>Confirmações arquivadas</h2></div><button className="export-button" type="button" onClick={exportArchivedList} disabled={archivedRsvps.isLoading || !archivedRows.length}><Download size={15} /> Exportar arquivados</button></div>{archivedRsvps.isLoading ? <div className="empty-state">Carregando histórico...</div> : archivedRows.length === 0 ? <div className="empty-state"><Archive size={22} /><p>Nenhuma confirmação arquivada.</p></div> : <div className="responses-table"><div className="table-head"><span>Convidado</span><span>Status</span><span>Arquivado em</span><span>Mensagem</span><span>Ação</span></div>{archivedRows.map(row => <div className="table-row" key={row.id}><div><strong>{row.guestName}</strong>{row.phone && <small>{row.phone}</small>}</div><span className={`status-pill ${row.status}`}><span />{row.status === "confirmed" ? "Confirmado" : "Não poderá ir"}</span><span>{row.archivedAt ? new Date(row.archivedAt).toLocaleDateString("pt-BR") : "—"}</span><span className="message-cell">{row.message || "—"}</span><button className="delete-rsvp-button" type="button" aria-label={`Restaurar confirmação de ${row.guestName}`} title="Restaurar confirmação" disabled={restoreRsvp.isPending} onClick={() => restoreArchivedRsvp(row.id, row.guestName)}><RotateCcw size={15} /></button></div>)}</div>}</section>}
        <section className="responses-card gifts-admin-card"><div className="responses-heading"><div><span className="section-kicker">Lista de presentes</span><h2>Reservas recebidas</h2></div><span className="live-indicator"><span /> {gifts.data?.filter(gift => gift.reservedAt).length ?? 0} reservados</span></div>{gifts.isLoading ? <div className="empty-state">Carregando reservas...</div> : gifts.data?.filter(gift => gift.reservedAt).length === 0 ? <div className="empty-state"><Gift size={22} /><p>Nenhum presente foi escolhido ainda.</p></div> : <div className="gift-admin-list">{gifts.data?.filter(gift => gift.reservedAt).map(gift => <div className="gift-admin-row" key={gift.id}><div><strong>{gift.title}</strong><small>{gift.category} · escolhido por {gift.reservedBy}</small>{gift.reservedPhone && <small>{gift.reservedPhone}</small>}</div><span>{gift.reservedAt ? new Date(gift.reservedAt).toLocaleDateString("pt-BR") : "—"}</span><button className="delete-rsvp-button" type="button" aria-label={`Liberar ${gift.title}`} title="Liberar para a lista" disabled={releaseGift.isPending} onClick={() => releaseReservedGift(gift.id, gift.title)}><RotateCcw size={15} /></button></div>)}</div>}</section>
      </main></div></DashboardLayout>;
}
