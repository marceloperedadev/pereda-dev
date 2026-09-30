import { NextRequest, NextResponse } from "next/server";
import { buildAdminCookie, clearAdminCookie, createAdminSession, isAdminAuthenticated, isAnalyticsConfigured } from "@/lib/server/analytics-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = isAnalyticsConfigured();
  return NextResponse.json({ authenticated: await isAdminAuthenticated(), configured });
}

export async function POST(request: NextRequest) {
  const configured = isAnalyticsConfigured();
  if (!configured.admin) return NextResponse.json({ error: "Configure ANALYTICS_ADMIN_SECRET no servidor." }, { status: 503 });
  let body: { password?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Requisição inválida." }, { status: 400 }); }
  if (typeof body.password !== "string" || body.password.length > 256) return NextResponse.json({ error: "Senha inválida." }, { status: 400 });
  const token = createAdminSession(body.password);
  if (!token) return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  const response = NextResponse.json({ authenticated: true, configured });
  response.headers.append("Set-Cookie", buildAdminCookie(token));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.headers.append("Set-Cookie", clearAdminCookie());
  return response;
}
