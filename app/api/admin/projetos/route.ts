import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/analytics-auth";
import { listManagedProjects, saveManagedProject } from "@/lib/server/portfolio-projects";
import type { Project } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const statuses = new Set(["draft", "analyzing", "needs_info", "review", "published", "archived"]);

function validProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") return false;
  const project = value as Record<string, unknown>;
  const strings = [project.category, project.type, project.h1, project.shortDescription, project.description, project.problem, project.solution, project.execution, project.objective];
  const list = (item: unknown) => Array.isArray(item) && item.length <= 40 && item.every(entry => typeof entry === "string" && entry.length <= 500);
  let safeUrl = false;
  try {
    const url = new URL(String(project.url));
    safeUrl = url.protocol === "https:" && !url.username && !url.password && !url.port && url.href.length <= 2048;
  } catch {
    safeUrl = project.url === "";
  }
  const cover = project.cover && typeof project.cover === "object" ? project.cover as Record<string, unknown> : {};
  const image = typeof cover.src === "string" && (cover.src === "" || (cover.src.startsWith("/") && !cover.src.startsWith("//") && !cover.src.includes("..")));
  const art = cover.art && typeof cover.art === "object" ? cover.art as Record<string, unknown> : {};
  return typeof project.slug === "string" && slugPattern.test(project.slug)
    && typeof project.name === "string" && project.name.trim().length >= 2 && project.name.length <= 160
    && strings.every(item => typeof item === "string" && item.length <= 5000)
    && list(project.features) && list(project.decisions) && list(project.tags) && list(project.stack)
    && safeUrl && typeof project.updatedAt === "string" && image && typeof cover.alt === "string"
    && ["mimoPet", "peredaEngenharia", "ortoclinica", "draValesca"].includes(String(art.variant))
    && typeof art.bg === "string" && typeof art.fg === "string" && typeof art.accent === "string";
}

function parseConfirmations(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length > 30) return null;
  const clean: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || item.trim().length === 0 || item.trim().length > 300) return null;
    clean.push(item.trim());
  }
  return clean;
}

function parseSourceFacts(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return NextResponse.json({ projects: await listManagedProjects() }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar projetos. Verifique Supabase e migration." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const pending = input.pendingConfirmations === undefined ? [] : parseConfirmations(input.pendingConfirmations);
  if (!validProject(input.project) || typeof input.status !== "string" || !statuses.has(input.status) || input.status === "published" || pending === null) {
    return NextResponse.json({ error: "Projeto inválido. Novos projetos começam como rascunho e não são publicados automaticamente." }, { status: 400 });
  }
  try {
    const saved = await saveManagedProject({
      slug: input.project.slug,
      project_data: input.project,
      status: input.status as never,
      source_url: typeof input.sourceUrl === "string" ? input.sourceUrl : null,
      source_facts: parseSourceFacts(input.sourceFacts),
      pending_confirmations: pending,
    });
    return NextResponse.json({ project: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar. Verifique se o slug já existe e se a migration foi aplicada." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const pending = parseConfirmations(input.pendingConfirmations);
  if (typeof input.id !== "string" || !/^[0-9a-f-]{36}$/i.test(input.id) || !validProject(input.project)
    || typeof input.status !== "string" || !statuses.has(input.status) || pending === null) {
    return NextResponse.json({ error: "Projeto inválido. Informe também a lista de pendências de confirmação." }, { status: 400 });
  }
  if (input.status === "published" && (!input.project.problem || !input.project.solution || !input.project.execution || !input.project.objective || !input.project.shortDescription)) {
    return NextResponse.json({ error: "Preencha apresentação, desafio, solução e descrição antes de publicar." }, { status: 422 });
  }
  if (input.status === "published" && pending.length > 0) {
    return NextResponse.json({ error: "Resolva ou remova as pendências de confirmação antes de publicar." }, { status: 422 });
  }
  try {
    const saved = await saveManagedProject({
      id: input.id,
      slug: input.project.slug,
      project_data: input.project,
      status: input.status as never,
      source_url: typeof input.sourceUrl === "string" ? input.sourceUrl : null,
      source_facts: parseSourceFacts(input.sourceFacts),
      pending_confirmations: pending,
    });
    return NextResponse.json({ project: saved }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Não foi possível atualizar o projeto." }, { status: 503 });
  }
}
