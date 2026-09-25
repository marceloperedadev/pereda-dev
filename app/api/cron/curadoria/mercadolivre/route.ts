import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { getCronSecret } from "@/lib/server/affiliate-env";
import { expireDiscoveredListing, getDueCurationRows, saveDiscoveredListing } from "@/lib/server/curation-store";
import { mercadoLivreCatalog } from "@/lib/server/mercadolivre-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SAFE_RUNTIME_MS = 52_000;
// Token read/refresh, item lookup and Supabase sync each have up to 8s timeout.
const WORST_CASE_ROW_MS = 40_000;

function authorized(request: Request, secret: string) {
  const authorization = request.headers.get("authorization") ?? "";
  const match = /^Bearer ([^\s]+)$/i.exec(authorization);
  const supplied = match?.[1] ?? "";
  const left = Buffer.from(supplied);
  const right = Buffer.from(secret);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function GET(request: Request) {
  const secret = getCronSecret();
  if (!secret || secret.length < 16) return NextResponse.json({ error: "CRON_SECRET ausente ou curto demais." }, { status: 503 });
  if (!authorized(request, secret)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const startedAt = Date.now();
    const rows = await getDueCurationRows(4);
    let processed = 0;
    let updated = 0;
    let expired = 0;
    let failed = 0;

    for (const row of rows) {
      if (Date.now() - startedAt + WORST_CASE_ROW_MS > SAFE_RUNTIME_MS) break;
      processed += 1;
      try {
        const listing = await mercadoLivreCatalog.getListing(row.source_product_id);
        if (listing.listingStatus !== "active") {
          await expireDiscoveredListing(row.provider, row.source_product_id);
          expired += 1;
        } else {
          await saveDiscoveredListing(listing, []);
          updated += 1;
        }
      } catch (error) {
        const status = typeof error === "object" && error !== null && "status" in error
          ? Number((error as { status: unknown }).status)
          : 0;
        if (status === 404 || status === 410) {
          await expireDiscoveredListing(row.provider, row.source_product_id);
          expired += 1;
        } else {
          failed += 1;
        }
        console.error("Curadoria: scheduled listing refresh failed", { provider: row.provider, status });
      }
    }

    return NextResponse.json({ processed, deferred: rows.length - processed, updated, expired, failed, checkedAt: new Date().toISOString() }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    console.error("Curadoria: scheduled job could not read the review queue");
    return NextResponse.json({ error: "Não foi possível executar a atualização da curadoria." }, { status: 503 });
  }
}
