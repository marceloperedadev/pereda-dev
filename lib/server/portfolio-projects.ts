import "server-only";
import { lookup } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { getPrivateTokenStoreConfig } from "@/lib/server/affiliate-env";
import type { Project } from "@/lib/data/projects";

export type ManagedProject = { id: string; slug: string; project_data: Project; status: "draft"|"analyzing"|"needs_info"|"review"|"published"|"archived"; source_url: string|null; source_facts: Record<string, unknown>; pending_confirmations: string[]; created_at: string; updated_at: string };
function config() { const c = getPrivateTokenStoreConfig(); if (!c) throw new Error("Supabase não configurado"); return c; }
function headers(key: string, extra?: HeadersInit) { const h = new Headers(extra); h.set("apikey", key); h.set("Authorization", `Bearer ${key}`); h.set("Content-Type", "application/json"); return h; }
async function table(path: string, init?: RequestInit) { const c = config(); const r = await fetch(`${c.url}/rest/v1/${path}`, { ...init, headers: headers(c.secretKey, init?.headers), cache: "no-store", signal: AbortSignal.timeout(8000) }); if (!r.ok) throw new Error(`Supabase portfolio failed (${r.status})`); return r; }
export async function listManagedProjects(): Promise<ManagedProject[]> { return table("portfolio_projects?select=*&order=updated_at.desc").then(r => r.json()); }
export async function saveManagedProject(data: { id?: string; slug: string; project_data: Project; status: ManagedProject["status"]; source_url?: string|null; source_facts?: Record<string, unknown>; pending_confirmations?: string[] }) {
  const row = { slug: data.slug, project_data: data.project_data, status: data.status, source_url: data.source_url ?? null, source_facts: data.source_facts ?? {}, pending_confirmations: data.pending_confirmations ?? [], updated_at: new Date().toISOString() };
  if (!data.id) return table("portfolio_projects", { method:"POST", headers:{Prefer:"return=representation"}, body:JSON.stringify(row) }).then(async r => (await r.json())[0] as ManagedProject);
  const currentRows = await table(`portfolio_projects?select=project_data,status&id=eq.${encodeURIComponent(data.id)}&limit=1`).then(r => r.json()) as { project_data: Project; status: string }[];
  if (!currentRows[0]) throw new Error("Project not found");
  await table(`portfolio_project_revisions?select=id`, { method:"POST", body:JSON.stringify({ project_id:data.id, project_data:currentRows[0].project_data, status:currentRows[0].status }) });
  return table(`portfolio_projects?id=eq.${encodeURIComponent(data.id)}`, { method:"PATCH", headers:{Prefer:"return=representation"}, body:JSON.stringify(row) }).then(async r => (await r.json())[0] as ManagedProject);
}
export async function getManagedProjectBySlug(slug: string) { const rows = await table(`portfolio_projects?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`).then(r=>r.json()) as ManagedProject[]; return rows[0]; }
export async function getPublishedManagedProjects() { return table("portfolio_projects?select=*&status=eq.published&order=updated_at.desc").then(r=>r.json()) as Promise<ManagedProject[]>; }
export async function getPublicPortfolioProjects(): Promise<Project[]> {
  let managed: ManagedProject[] = [];
  try { managed = await listManagedProjects(); } catch { /* Static catalog remains available without Supabase. */ }
  const bySlug = new Map<string, ManagedProject>(managed.map(row => [row.slug, row]));
  const { projects: staticProjects } = await import("@/lib/data/projects");
  const merged = staticProjects.flatMap(project => {
    const record = bySlug.get(project.slug);
    if (record?.status === "archived") return [];
    if (record?.status === "published") return [record.project_data];
    return [project];
  });
  const known = new Set<string>(staticProjects.map(project => project.slug));
  return [...merged, ...managed.filter(row => !known.has(row.slug) && row.status === "published").map(row => row.project_data)];
}
export async function getPublicPortfolioProject(slug: string): Promise<Project | undefined> {
  try { const row = await getManagedProjectBySlug(slug); if (row?.status === "published") return row.project_data; if (row?.status === "archived") return undefined; } catch { /* Fall back to static catalog. */ }
  const { projects } = await import("@/lib/data/projects");
  return projects.find(project => project.slug === slug);
}export async function listProjectRevisions(id: string) { return table(`portfolio_project_revisions?select=id,status,changed_at,project_data&project_id=eq.${encodeURIComponent(id)}&order=changed_at.desc&limit=50`).then(r=>r.json()); }

function forbiddenAddress(address: string) {
  const normalized = address.toLowerCase();
  if (normalized.startsWith("::ffff:")) {
    const mapped = normalized.slice(7);
    if (mapped.includes(".")) return forbiddenAddress(mapped);
  }
  if (normalized.includes(":")) {
    if (normalized === "::" || normalized === "::1" || normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb") || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("ff") || normalized.startsWith("fec") || normalized.startsWith("fed") || normalized.startsWith("fee") || normalized.startsWith("fef")) return true;
    return !/^[23]/.test(normalized);
  }
  const parts = normalized.split(".").map(Number);
  if (parts.length !== 4 || parts.some(n => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  return parts[0] === 10 || parts[0] === 127 || (parts[0] === 169 && parts[1] === 254) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) || parts[0] === 0 || parts[0] >= 224;
}
async function validatePublicUrl(raw: string) {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.href.length > 2048) throw new Error("Use uma URL HTTPS pública, sem credenciais ou porta personalizada.");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") || host === "metadata.google.internal") throw new Error("Endereços locais ou internos não são aceitos.");
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(item => forbiddenAddress(item.address))) throw new Error("O domínio resolve para um endereço privado ou não permitido.");
  return url;
}
function decodeEntities(s: string) { return s.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))); }
function metadata(html: string, key: string) { const escaped = key.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); const a = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["']`,"i")); const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["']`,"i")); return decodeEntities((a?.[1] ?? b?.[1] ?? "").trim()).slice(0,1000) || null; }
export async function analyzePublicProject(raw: string) {
  if (typeof raw !== "string" || raw.length > 2048) throw new Error("URL inválida.");
  let url = await validatePublicUrl(raw);
  let response: { status: number; contentType: string; contentLength: number; location: string | null; body: Buffer } | undefined;
  for (let hop=0; hop<=3; hop++) {
    const addresses = isIP(url.hostname) ? [{ address: url.hostname, family: isIP(url.hostname) }] : await lookup(url.hostname, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(item => forbiddenAddress(item.address))) throw new Error("O domínio resolve para um endereço privado ou não permitido.");
    response = await new Promise((resolve, reject) => {
      const req = httpsRequest(url, { headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "PeredaDevPortfolioAnalyzer/1.0" }, lookup: (_host, options, callback) => {
        const pinned = addresses.map(item => ({ address: item.address, family: item.family }));
        if (options && typeof options === "object" && "all" in options && options.all) callback(null, pinned);
        else callback(null, pinned[0].address, pinned[0].family);
      } }, res => {
        const chunks: Buffer[] = []; let bytes = 0;
        res.on("data", (chunk: Buffer) => { bytes += chunk.length; if (bytes > 1_000_000) req.destroy(new Error("A página excede o limite de análise.")); else chunks.push(chunk); });
        res.on("end", () => resolve({ status: res.statusCode ?? 0, contentType: String(res.headers["content-type"] ?? ""), contentLength: Number(res.headers["content-length"] ?? 0), location: typeof res.headers.location === "string" ? res.headers.location : null, body: Buffer.concat(chunks) }));
      });
      req.setTimeout(7000, () => req.destroy(new Error("Tempo limite ao consultar o site.")));
      req.on("error", reject); req.end();
    });
    const currentResponse = response!;
    if ([301,302,303,307,308].includes(currentResponse.status)) { if (!currentResponse.location || hop===3) throw new Error("Redirecionamento não permitido ou excessivo."); url=await validatePublicUrl(new URL(currentResponse.location,url).toString()); continue; }
    break;
  }
  const finalResponse = response;
  if (!finalResponse || finalResponse.status < 200 || finalResponse.status >= 300) throw new Error(`O site respondeu com status ${finalResponse?.status ?? "inválido"}.`);
  if (!finalResponse.contentType.toLowerCase().includes("text/html")) throw new Error("O endereço não retornou uma página HTML pública.");
  if (finalResponse.contentLength > 1_000_000) throw new Error("A página excede o limite de análise.");
  const html=new TextDecoder().decode(finalResponse.body);
  const title=metadata(html,"og:title") ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g,"").trim().slice(0,300) ?? null;
  const description=metadata(html,"og:description") ?? metadata(html,"description");
  const image=metadata(html,"og:image");
  const siteName=metadata(html,"og:site_name");
  let imageUrl: string|null=null; if(image) try { const parsed=new URL(image,url); if(parsed.protocol==="https:") imageUrl=parsed.toString(); } catch {}
  return { url:url.toString(), title:title?decodeEntities(title):null, description, imageUrl, siteName, fetchedAt:new Date().toISOString(), notice:"Metadados públicos observados. Conteúdo, funcionalidades, stack e resultados comerciais não são confirmados por esta análise." };
}
