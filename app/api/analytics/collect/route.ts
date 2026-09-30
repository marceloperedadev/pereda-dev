import { NextRequest, NextResponse } from "next/server";
import { insertEvent, insertPageview, upsertSession } from "@/lib/server/analytics-db";
import { parseTrafficSource, parseUserAgent } from "@/lib/server/analytics-ua";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const eventNames = new Set([
  "page_view", "view_project", "click_project", "project_view", "project_cta_click",
  "click_whatsapp", "click_email", "click_linkedin", "click_github", "start_contact",
  "submit_contact", "scroll_50", "scroll_75", "scroll_90", "setup_search", "setup_filter",
  "setup_guide_step", "setup_guide_complete", "setup_content_view", "setup_product_view",
  "setup_product_click", "setup_affiliate_click",
]);
const safeStringProperties = new Set([
  "project_name", "project_category", "cta_location", "cta_name", "interaction", "project_type",
  "question", "content_type", "content_id", "content_title", "product_id", "product_name",
  "category", "store", "position", "source_type", "source_id", "source",
]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cleanPath(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 300 || !value.startsWith("/") || value.startsWith("//") || /[?#\r\n]/.test(value)) return null;
  return value;
}

function cleanProperties(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (key === "page_path") {
      const path = cleanPath(item);
      if (path) result.page_path = path;
    } else if (safeStringProperties.has(key) && typeof item === "string" && item.length <= 120) {
      result[key] = item;
    } else if (["step", "project_position"].includes(key) && typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 1000) {
      result[key] = item;
    }
  }
  return result;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 8_000) return NextResponse.json({ error: "Payload muito grande." }, { status: 413 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido." }, { status: 400 }); }

  const sessionId = body.sessionId;
  const visitorId = body.visitorId;
  const eventName = body.eventName;
  const pagePath = cleanPath(body.pagePath);
  if (typeof sessionId !== "string" || !uuidPattern.test(sessionId) || typeof visitorId !== "string" || !uuidPattern.test(visitorId) || typeof eventName !== "string" || !eventNames.has(eventName) || !pagePath) {
    return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  }

  const referrer = typeof body.referrer === "string" ? (() => { try { return new URL(body.referrer).origin.slice(0, 300); } catch { return null; } })() : null;
  const utm = body.utm && typeof body.utm === "object" ? body.utm as Record<string, unknown> : {};
  const takeUtm = (name: string) => {
    if (!["utm_source", "utm_medium", "utm_campaign"].includes(name) || typeof utm[name] !== "string") return null;
    const value = (utm[name] as string).trim().slice(0, 100);
    return /^[\p{L}\p{N} _.:-]+$/u.test(value) ? value : null;
  };
  const ua = parseUserAgent(request.headers.get("user-agent") ?? "");
  const props = cleanProperties(body.properties);
  props.page_path = pagePath;

  try {
    await upsertSession({
      session_id: sessionId,
      visitor_id: visitorId,
      is_new_visitor: body.isNewVisitor === true,
      landing_page: pagePath,
      referrer,
      source: parseTrafficSource(referrer, takeUtm("utm_source")),
      utm_source: takeUtm("utm_source"),
      utm_medium: takeUtm("utm_medium"),
      utm_campaign: takeUtm("utm_campaign"),
      utm_content: takeUtm("utm_content"),
      utm_term: takeUtm("utm_term"),
      device_type: ua.deviceType,
      os: ua.os,
      browser: ua.browser,
      viewport_width: Number.isInteger(body.viewportWidth) ? Number(body.viewportWidth) : null,
      viewport_height: Number.isInteger(body.viewportHeight) ? Number(body.viewportHeight) : null,
    });

    const writes: Promise<unknown>[] = [insertEvent({ session_id: sessionId, event_name: eventName, page_path: pagePath, properties: props })];
    if (eventName === "page_view") {
      writes.push(insertPageview({ session_id: sessionId, page_path: pagePath, page_title: typeof body.pageTitle === "string" ? body.pageTitle.slice(0, 200) : null, referrer }).then((inserted) => {
        if (!inserted) throw new Error("Pageview insert failed");
        return inserted;
      }));
    }
    await Promise.all(writes);
    return new NextResponse(null, { status: 204 });
  } catch {
    // O site continua funcionando quando o armazenamento de analytics falha.
    return new NextResponse(null, { status: 204 });
  }
}
