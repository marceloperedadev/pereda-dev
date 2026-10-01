"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./AnalyticsAdmin.module.css";

type Dashboard = {
  visitors: number; newVisitors: number; returningVisitors: number; sessions: number; pageviews: number;
  events: number; conversions: number; conversionRate: number; avgPageviewsPerSession: number;
  avgSessionDurationMs: number; clicksWhatsapp: number; clicksEmail: number; startContact: number;
  submitContact: number; projectViews: number; topPages: { path: string; views: number }[];
  topEvents: { name: string; count: number }[];
};

function number(value: number) { return new Intl.NumberFormat("pt-BR").format(value); }
function duration(value: number) {
  const minutes = Math.floor(value / 60_000);
  const seconds = Math.floor(value / 1_000) % 60;
  return `${minutes} min ${seconds.toString().padStart(2, "0")} s`;
}

export function AnalyticsAdmin({ initialAuthenticated, initialConfigured }: { initialAuthenticated: boolean; initialConfigured: { admin: boolean; supabase: boolean } }) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [configured, setConfigured] = useState<{ admin: boolean; supabase: boolean } | null>(initialConfigured);
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Dashboard | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (period = days) => {
    setBusy(true); setError(""); setData(null);
    try {
      const response = await fetch(`/api/admin/analytics?days=${period}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Falha ao carregar o painel.");
      setData(result.data);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Falha ao carregar o painel."); }
    finally { setBusy(false); }
  }, [days]);

  useEffect(() => {
    if (initialAuthenticated && initialConfigured.supabase) void load();
    else setBusy(false);
  }, [initialAuthenticated, initialConfigured.supabase, load]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/analytics/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível entrar.");
      setAuthenticated(true); setPassword(""); setConfigured(result.configured);
      if (result.configured?.supabase) await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível entrar."); setBusy(false); }
  }

  async function signOut() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/analytics/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Não foi possível encerrar a sessão.");
      setAuthenticated(false); setData(null);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível encerrar a sessão."); }
    finally { setBusy(false); }
  }

  return <section className={styles.page}>
    <p className={styles.eyebrow}>Área administrativa</p>
    <h1>Analytics do portfólio</h1>
    {!authenticated ? <form className={styles.login} onSubmit={signIn}>
      <p>Acesse com a senha administrativa configurada no servidor.</p>
      {!configured?.admin && configured ? <p className={styles.error}>Configure ANALYTICS_ADMIN_SECRET nas variáveis de ambiente.</p> : null}
      <label>Senha<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><small className={styles.fieldHint}>Senha administrativa definida no servidor.</small></label>
      <button disabled={busy || !configured?.admin}>{busy ? "Verificando…" : "Entrar"}</button>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
    </form> : <>
      <div className={styles.toolbar}><label>Período<select value={days} onChange={(event) => { const next = Number(event.target.value); setDays(next); void load(next); }}><option value={7}>Últimos 7 dias</option><option value={30}>Últimos 30 dias</option><option value={90}>Últimos 90 dias</option></select><small className={styles.fieldHint}>Intervalo contado para trás a partir de hoje.</small></label><button className={styles.secondary} onClick={() => void load()}>Atualizar</button><button className={styles.secondary} onClick={() => void signOut()}>Sair</button></div>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {!configured?.supabase ? <p className={styles.error}>Configure SUPABASE_URL, SUPABASE_SECRET_KEY e aplique a migration de analytics.</p> : null}
      {busy ? <p>Carregando dados…</p> : data && data.sessions === 0 && data.pageviews === 0 && data.events === 0 ? <p className={styles.empty}>Nenhum dado disponível no período selecionado.</p> : data ? <>
        <div className={styles.metrics}>
          <article><span>Visitantes únicos</span><strong>{number(data.visitors)}</strong><small>{number(data.newVisitors)} novos · {number(data.returningVisitors)} recorrentes</small></article>
          <article><span>Sessões</span><strong>{number(data.sessions)}</strong><small>Duração média: {duration(data.avgSessionDurationMs)}</small></article>
          <article><span>Visualizações de página</span><strong>{number(data.pageviews)}</strong><small>{data.avgPageviewsPerSession.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} por sessão</small></article>
          <article><span>Briefings iniciados</span><strong>{number(data.conversions)}</strong><small>{data.conversionRate.toFixed(1)}% das sessões iniciaram contato</small></article>
        </div>
        <div className={styles.columns}><section className={styles.panel}><h2>Páginas mais visitadas</h2>{data.topPages.length ? <ol>{data.topPages.map((page) => <li key={page.path}><span>{page.path}</span><strong>{number(page.views)}</strong></li>)}</ol> : <p>Sem visualizações neste período.</p>}</section><section className={styles.panel}><h2>Eventos frequentes</h2>{data.topEvents.length ? <ol>{data.topEvents.map((item) => <li key={item.name}><span>{item.name}</span><strong>{number(item.count)}</strong></li>)}</ol> : <p>Sem eventos neste período.</p>}</section></div>
        <section className={styles.panel}><h2>Contatos e projetos</h2><div className={styles.quickMetrics}><p><strong>{number(data.clicksWhatsapp)}</strong> cliques no WhatsApp</p><p><strong>{number(data.clicksEmail)}</strong> cliques no e-mail</p><p><strong>{number(data.startContact)}</strong> contatos iniciados</p><p><strong>{number(data.submitContact)}</strong> cliques para enviar briefing</p><p><strong>{number(data.projectViews)}</strong> projetos visualizados</p></div></section>
      </> : null}
    </>}
  </section>;
}
