import { NextResponse } from "next/server";

import { requireCurationAdmin } from "@/lib/server/curation-auth";
import { mercadoLivreCatalog } from "@/lib/server/mercadolivre-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireCurationAdmin(request);
  if (denied) return denied;

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 100) {
    return NextResponse.json({ error: "Informe uma busca entre 2 e 100 caracteres." }, { status: 400 });
  }

  try {
    const results = await mercadoLivreCatalog.search(query, 10);
    return NextResponse.json({ provider: "mercadolivre", results }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (error) {
    const status = typeof error === "object" && error !== null && "status" in error
      ? Number((error as { status: unknown }).status)
      : 0;
    const httpStatus = status === 401 || status === 403 ? 502 : status === 429 ? 503 : 502;
    console.error("Curadoria: Mercado Livre search failed", { status });
    return NextResponse.json({ error: "Não foi possível consultar o Mercado Livre agora." }, { status: httpStatus });
  }
}
