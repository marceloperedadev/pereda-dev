import "server-only";

import { getPrivateTokenStoreConfig } from "@/lib/server/affiliate-env";

/** Retorna a configuração do Supabase ou lança erro se não configurado. */
function getConfig() {
  const config = getPrivateTokenStoreConfig();
  if (!config) {
    throw new Error("Supabase não configurado (SUPABASE_URL ou SUPABASE_SECRET_KEY ausente).");
  }
  return config;
}

/** Monta headers padrão para o Supabase REST API. */
function makeHeaders(key: string, extra?: Record<string, string>): Headers {
  const h = new Headers(extra);
  h.set("apikey", key);
  h.set("Authorization", `Bearer ${key}`);
  h.set("Content-Type", "application/json");
  return h;
}

/** Timeout padrão para chamadas de analytics (não bloqueia o request principal). */
const TIMEOUT_MS = 5_000;

// ------------------------------------------------------------------
// Inserção e upsert
// ------------------------------------------------------------------

export async function upsertSession(params: {
  session_id: string;
  visitor_id: string | null;
  is_new_visitor: boolean;
  landing_page: string | null;
  referrer: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  viewport_width: number | null;
  viewport_height: number | null;
}): Promise<void> {
  const config = getConfig();
  const url = `${config.url}/rest/v1/rpc/upsert_analytics_session`;

  const response = await fetch(url, {
    method: "POST",
    headers: makeHeaders(config.secretKey),
    body: JSON.stringify({
      p_session_id: params.session_id,
      p_visitor_id: params.visitor_id,
      p_is_new_visitor: params.is_new_visitor,
      p_landing_page: params.landing_page,
      p_referrer: params.referrer,
      p_source: params.source,
      p_utm_source: params.utm_source,
      p_utm_medium: params.utm_medium,
      p_utm_campaign: params.utm_campaign,
      p_utm_content: params.utm_content,
      p_utm_term: params.utm_term,
      p_device_type: params.device_type,
      p_os: params.os,
      p_browser: params.browser,
      p_viewport_width: params.viewport_width,
      p_viewport_height: params.viewport_height,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error("Analytics session upsert failed");
}

export async function insertPageview(params: {
  session_id: string;
  page_path: string;
  page_title: string | null;
  referrer: string | null;
}): Promise<{ id: number } | null> {
  const config = getConfig();
  const url = `${config.url}/rest/v1/analytics_pageviews`;

  const res = await fetch(url, {
    method: "POST",
    headers: makeHeaders(config.secretKey, { Prefer: "return=representation" }),
    body: JSON.stringify(params),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) throw new Error("Analytics pageview insert failed");
  const rows = await res.json() as { id: number }[];

  return rows[0] ?? null;
}

export async function updatePageviewDuration(
  pageviewId: number,
  durationMs: number,
): Promise<void> {
  const config = getConfig();
  await fetch(`${config.url}/rest/v1/analytics_pageviews?id=eq.${pageviewId}`, {
    method: "PATCH",
    headers: makeHeaders(config.secretKey),
    body: JSON.stringify({ duration_ms: durationMs }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

export async function insertEvent(params: {
  session_id: string;
  event_name: string;
  page_path: string | null;
  properties: Record<string, unknown> | null;
}): Promise<void> {
  const config = getConfig();

  const response = await fetch(`${config.url}/rest/v1/analytics_events`, {
    method: "POST",
    headers: makeHeaders(config.secretKey),
    body: JSON.stringify(params),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error("Analytics event insert failed");
}

// ------------------------------------------------------------------
// Consultas do painel (usadas pelas rotas /api/analytics/admin/*)
// ------------------------------------------------------------------

function periodFilter(field: string, start: Date, end: Date): string {
  return `${field}=gte.${start.toISOString()}&${field}=lte.${end.toISOString()}`;
}

export async function queryDashboard(start: Date, end: Date) {
  const config = getConfig();

  const [sessions, pageviews, events] = await Promise.all([
    // Sessions no período
    fetch(
      `${config.url}/rest/v1/analytics_sessions?select=session_id,visitor_id,is_new_visitor,pageview_count,event_count,converted,started_at,last_seen_at&${periodFilter("started_at", start, end)}&limit=10000`,
      { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
    ).then((r) => { if (!r.ok) throw new Error("Analytics sessions query failed"); return r.json(); }) as Promise<{
      session_id: string;
      visitor_id: string | null;
      is_new_visitor: boolean;
      pageview_count: number;
      event_count: number;
      converted: boolean;
      started_at: string;
      last_seen_at: string;
    }[]>,

    // Pageviews no período (agrupados por path)
    fetch(
      `${config.url}/rest/v1/analytics_pageviews?select=page_path,session_id&${periodFilter("occurred_at", start, end)}&limit=50000`,
      { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
    ).then((r) => { if (!r.ok) throw new Error("Analytics pageviews query failed"); return r.json(); }) as Promise<{ page_path: string; session_id: string }[]>,

    // Eventos no período
    fetch(
      `${config.url}/rest/v1/analytics_events?select=event_name,session_id&${periodFilter("occurred_at", start, end)}&limit=50000`,
      { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
    ).then((r) => { if (!r.ok) throw new Error("Analytics events query failed"); return r.json(); }) as Promise<{ event_name: string; session_id: string }[]>,
  ]);

  // Cálculos no JS (evita funções de agregação complexas via REST)
  const totalSessions = sessions.length;
  const uniqueVisitors = new Set(sessions.map((s) => s.visitor_id ?? s.session_id)).size;
  const newVisitors = new Set(sessions.filter((s) => s.is_new_visitor).map((s) => s.visitor_id ?? s.session_id)).size;
  const returningVisitors = new Set(sessions.filter((s) => !s.is_new_visitor).map((s) => s.visitor_id ?? s.session_id)).size;
  const totalPageviews = sessions.reduce((sum, s) => sum + s.pageview_count, 0);
  const conversions = new Set(events.filter((event) => event.event_name === "submit_contact").map((event) => event.session_id)).size;
  const avgPageviewsPerSession = totalSessions > 0 ? totalPageviews / totalSessions : 0;

  const durations = sessions.map((s) => {
    const start = new Date(s.started_at).getTime();
    const end = new Date(s.last_seen_at).getTime();
    return end - start;
  }).filter((d) => d > 0);
  const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

  // Contagem de eventos específicos
  const countEvent = (name: string) => events.filter((e) => e.event_name === name).length;

  // Top páginas
  const pathCounts: Record<string, number> = {};
  for (const pv of pageviews) {
    pathCounts[pv.page_path] = (pathCounts[pv.page_path] ?? 0) + 1;
  }
  const topPages = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, views]) => ({ path, views }));

  // Top eventos
  const eventCounts: Record<string, number> = {};
  for (const ev of events) {
    eventCounts[ev.event_name] = (eventCounts[ev.event_name] ?? 0) + 1;
  }
  const topEvents = Object.entries(eventCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return {
    visitors: uniqueVisitors,
    newVisitors,
    returningVisitors,
    sessions: totalSessions,
    pageviews: totalPageviews,
    events: events.length,
    conversions,
    conversionRate: totalSessions > 0 ? (conversions / totalSessions) * 100 : 0,
    avgPageviewsPerSession,
    avgSessionDurationMs: avgDuration,
    clicksWhatsapp: countEvent("click_whatsapp"),
    clicksEmail: countEvent("click_email"),
    startContact: countEvent("start_contact"),
    submitContact: countEvent("submit_contact"),
    projectViews: countEvent("project_view"),
    topPages,
    topEvents,
  };
}

export async function queryRealtime() {
  const config = getConfig();
  const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const sessions = await fetch(
    `${config.url}/rest/v1/analytics_sessions?select=session_id,started_at,last_seen_at,landing_page,referrer,source,utm_source,utm_medium,utm_campaign,device_type,browser,os,pageview_count,converted&last_seen_at=gte.${since}&order=last_seen_at.desc&limit=50`,
    { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
  ).then((r) => r.ok ? r.json() : []) as Promise<unknown[]>;

  // Última página de cada sessão ativa
  const sessionList = await sessions;

  const pageviewPromises = (sessionList as { session_id: string }[]).map((s) =>
    fetch(
      `${config.url}/rest/v1/analytics_pageviews?select=page_path&session_id=eq.${encodeURIComponent(s.session_id)}&order=occurred_at.desc&limit=1`,
      { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(4_000) },
    ).then((r) => r.ok ? r.json() : []).then((rows: { page_path: string }[]) => ({
      session_id: s.session_id,
      current_page: rows[0]?.page_path ?? "/",
    })).catch(() => ({ session_id: s.session_id, current_page: "/" })),
  );

  const currentPages = await Promise.all(pageviewPromises);
  const pageMap = Object.fromEntries(currentPages.map((p) => [p.session_id, p.current_page]));

  return {
    activeSessions: (sessionList as { session_id: string }[]).length,
    sessions: (sessionList as Record<string, unknown>[]).map((s) => ({
      ...s,
      current_page: pageMap[(s as { session_id: string }).session_id] ?? "/",
    })),
  };
}

export async function queryPages(start: Date, end: Date, sortBy = "views", limit = 50, offset = 0) {
  const config = getConfig();

  const rows = await fetch(
    `${config.url}/rest/v1/analytics_pageviews?select=page_path,session_id,duration_ms&${periodFilter("occurred_at", start, end)}&limit=50000`,
    { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
  ).then((r) => r.ok ? r.json() : []) as { page_path: string; session_id: string; duration_ms: number | null }[];

  const pageMap: Record<string, { views: number; sessions: Set<string>; durations: number[] }> = {};
  for (const row of rows) {
    if (!pageMap[row.page_path]) {
      pageMap[row.page_path] = { views: 0, sessions: new Set(), durations: [] };
    }
    pageMap[row.page_path].views++;
    pageMap[row.page_path].sessions.add(row.session_id);
    if (row.duration_ms != null) pageMap[row.page_path].durations.push(row.duration_ms);
  }

  let pages = Object.entries(pageMap).map(([path, data]) => ({
    path,
    views: data.views,
    unique_visitors: data.sessions.size,
    avg_duration_ms: data.durations.length > 0
      ? Math.round(data.durations.reduce((a, b) => a + b, 0) / data.durations.length)
      : 0,
  }));

  if (sortBy === "duration") {
    pages = pages.sort((a, b) => b.avg_duration_ms - a.avg_duration_ms);
  } else {
    pages = pages.sort((a, b) => b.views - a.views);
  }

  return {
    pages: pages.slice(offset, offset + limit),
    total: pages.length,
  };
}

export async function queryProjects(start: Date, end: Date) {
  const config = getConfig();

  const events = await fetch(
    `${config.url}/rest/v1/analytics_events?select=event_name,session_id,properties&event_name=in.(project_view,click_whatsapp,submit_contact)&${periodFilter("occurred_at", start, end)}&limit=20000`,
    { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
  ).then((r) => r.ok ? r.json() : []) as {
    event_name: string;
    session_id: string;
    properties: { project_name?: string; project_category?: string } | null;
  }[];

  const projectMap: Record<string, {
    views: number;
    visitors: Set<string>;
    whatsapp: number;
    contact: number;
  }> = {};

  for (const ev of events) {
    if (ev.event_name === "project_view" && ev.properties?.project_name) {
      const name = ev.properties.project_name;
      if (!projectMap[name]) projectMap[name] = { views: 0, visitors: new Set(), whatsapp: 0, contact: 0 };
      projectMap[name].views++;
      projectMap[name].visitors.add(ev.session_id);
    }
  }

  return Object.entries(projectMap)
    .map(([name, data]) => ({
      name,
      views: data.views,
      visitors: data.visitors.size,
      whatsapp_clicks: data.whatsapp,
      contact_submissions: data.contact,
    }))
    .sort((a, b) => b.views - a.views);
}

export async function queryEvents(
  start: Date,
  end: Date,
  nameFilter?: string,
  limit = 100,
  offset = 0,
) {
  const config = getConfig();

  let url = `${config.url}/rest/v1/analytics_events?select=id,event_name,page_path,occurred_at,session_id,properties&${periodFilter("occurred_at", start, end)}&order=occurred_at.desc`;
  if (nameFilter) url += `&event_name=eq.${encodeURIComponent(nameFilter)}`;
  url += `&limit=${limit}&offset=${offset}`;

  const [events, summary] = await Promise.all([
    fetch(url, { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) })
      .then((r) => r.ok ? r.json() : []),

    fetch(
      `${config.url}/rest/v1/analytics_events?select=event_name&${periodFilter("occurred_at", start, end)}&limit=100000`,
      { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
    ).then((r) => r.ok ? r.json() : []) as Promise<{ event_name: string }[]>,
  ]);

  const counts: Record<string, number> = {};
  for (const ev of (summary as { event_name: string }[])) {
    counts[ev.event_name] = (counts[ev.event_name] ?? 0) + 1;
  }

  return {
    events,
    summary: Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ event_name: name, count })),
    total: (summary as unknown[]).length,
  };
}

export async function querySources(start: Date, end: Date) {
  const config = getConfig();

  const sessions = await fetch(
    `${config.url}/rest/v1/analytics_sessions?select=source,referrer,utm_source,utm_medium,utm_campaign,utm_content,utm_term,visitor_id,converted&${periodFilter("started_at", start, end)}&limit=10000`,
    { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
  ).then((r) => r.ok ? r.json() : []) as {
    source: string | null;
    referrer: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
    visitor_id: string | null;
    converted: boolean;
  }[];

  const sourceMap: Record<string, { sessions: number; conversions: number }> = {};
  const campaignMap: Record<string, { source: string | null; medium: string | null; sessions: number }> = {};
  const utmSources: Record<string, number> = {};
  const utmMediums: Record<string, number> = {};
  const utmCampaigns: Record<string, number> = {};

  for (const s of sessions) {
    const src = s.source ?? s.utm_source ?? (s.referrer ? "referral" : "direct");
    sourceMap[src] = sourceMap[src] ?? { sessions: 0, conversions: 0 };
    sourceMap[src].sessions++;
    if (s.converted) sourceMap[src].conversions++;

    if (s.utm_campaign) {
      campaignMap[s.utm_campaign] = campaignMap[s.utm_campaign] ?? { source: s.utm_source, medium: s.utm_medium, sessions: 0 };
      campaignMap[s.utm_campaign].sessions++;
    }

    if (s.utm_source) utmSources[s.utm_source] = (utmSources[s.utm_source] ?? 0) + 1;
    if (s.utm_medium) utmMediums[s.utm_medium] = (utmMediums[s.utm_medium] ?? 0) + 1;
    if (s.utm_campaign) utmCampaigns[s.utm_campaign] = (utmCampaigns[s.utm_campaign] ?? 0) + 1;
  }

  return {
    sources: Object.entries(sourceMap)
      .sort((a, b) => b[1].sessions - a[1].sessions)
      .map(([source, data]) => ({ source, ...data })),
    campaigns: Object.entries(campaignMap)
      .sort((a, b) => b[1].sessions - a[1].sessions)
      .map(([campaign, data]) => ({ campaign, ...data })),
    utmSources: Object.entries(utmSources).sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count })),
    utmMediums: Object.entries(utmMediums).sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count })),
    utmCampaigns: Object.entries(utmCampaigns).sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count })),
  };
}

export async function queryDevices(start: Date, end: Date) {
  const config = getConfig();

  const sessions = await fetch(
    `${config.url}/rest/v1/analytics_sessions?select=device_type,os,browser,viewport_width,viewport_height&${periodFilter("started_at", start, end)}&limit=10000`,
    { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
  ).then((r) => r.ok ? r.json() : []) as {
    device_type: string | null;
    os: string | null;
    browser: string | null;
    viewport_width: number | null;
    viewport_height: number | null;
  }[];

  const toPercent = (counts: Record<string, number>, total: number) =>
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 }));

  const deviceTypes: Record<string, number> = {};
  const oses: Record<string, number> = {};
  const browsers: Record<string, number> = {};

  for (const s of sessions) {
    const dt = s.device_type ?? "unknown";
    const os = s.os ?? "Unknown";
    const br = s.browser ?? "Unknown";
    deviceTypes[dt] = (deviceTypes[dt] ?? 0) + 1;
    oses[os] = (oses[os] ?? 0) + 1;
    browsers[br] = (browsers[br] ?? 0) + 1;
  }

  const total = sessions.length;

  return {
    deviceTypes: toPercent(deviceTypes, total),
    browsers: toPercent(browsers, total),
    operatingSystems: toPercent(oses, total),
    total,
  };
}

export async function querySessionList(start: Date, end: Date, limit = 50, offset = 0) {
  const config = getConfig();

  const [sessions, total] = await Promise.all([
    fetch(
      `${config.url}/rest/v1/analytics_sessions?select=session_id,visitor_id,is_new_visitor,started_at,last_seen_at,landing_page,referrer,source,utm_source,utm_medium,utm_campaign,device_type,os,browser,pageview_count,event_count,converted&${periodFilter("started_at", start, end)}&order=started_at.desc&limit=${limit}&offset=${offset}`,
      { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
    ).then((r) => r.ok ? r.json() : []),
    fetch(
      `${config.url}/rest/v1/analytics_sessions?select=id&${periodFilter("started_at", start, end)}`,
      { headers: makeHeaders(config.secretKey, { Prefer: "count=exact" }), cache: "no-store", signal: AbortSignal.timeout(8_000) },
    ).then((r) => {
      const range = r.headers.get("Content-Range");
      if (range) {
        const match = range.match(/\/(\d+)$/);
        if (match) return parseInt(match[1], 10);
      }
      return 0;
    }),
  ]);

  return { sessions, total };
}

export async function querySessionJourney(sessionId: string) {
  const config = getConfig();

  const [session, pageviews, events] = await Promise.all([
    fetch(
      `${config.url}/rest/v1/analytics_sessions?select=*&session_id=eq.${encodeURIComponent(sessionId)}&limit=1`,
      { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
    ).then((r) => r.ok ? r.json() : []).then((rows: unknown[]) => rows[0] ?? null),
    fetch(
      `${config.url}/rest/v1/analytics_pageviews?select=page_path,page_title,occurred_at,duration_ms&session_id=eq.${encodeURIComponent(sessionId)}&order=occurred_at.asc&limit=200`,
      { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
    ).then((r) => r.ok ? r.json() : []),
    fetch(
      `${config.url}/rest/v1/analytics_events?select=event_name,page_path,occurred_at,properties&session_id=eq.${encodeURIComponent(sessionId)}&order=occurred_at.asc&limit=500`,
      { headers: makeHeaders(config.secretKey), cache: "no-store", signal: AbortSignal.timeout(8_000) },
    ).then((r) => r.ok ? r.json() : []),
  ]);

  return { session, pageviews, events };
}
