import { NextRequest, NextResponse } from "next/server";
import { isAnalyticsConfigured, requireAdmin } from "@/lib/server/analytics-auth";
import { queryDashboard } from "@/lib/server/analytics-db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  if (!isAnalyticsConfigured().supabase) return NextResponse.json({ error: "Configure o Supabase para consultar os dados." }, { status: 503 });
  const daysValue = Number(request.nextUrl.searchParams.get("days") ?? "30");
  const days = Number.isInteger(daysValue) && daysValue >= 1 && daysValue <= 365 ? daysValue : 30;
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  try {
    return NextResponse.json({ data: await queryDashboard(start, end), period: { days, start: start.toISOString(), end: end.toISOString() } }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Não foi possível consultar o analytics. Confira a conexão e a migration do Supabase." }, { status: 502 });
  }
}
