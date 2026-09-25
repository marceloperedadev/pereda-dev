import "server-only";

import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { getMercadoLivreConnectGuard } from "@/lib/server/affiliate-env";

function equals(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function requireCurationAdmin(request: Request): NextResponse | undefined {
  const guard = getMercadoLivreConnectGuard();
  if (!guard) {
    return NextResponse.json({ error: "Acesso administrativo não configurado." }, { status: 503 });
  }

  const expected = `Basic ${Buffer.from(`${guard.username}:${guard.password}`).toString("base64")}`;
  if (equals(request.headers.get("authorization") ?? "", expected)) return undefined;

  return new NextResponse("Autenticação necessária.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Pereda Dev Curadoria", charset="UTF-8"' },
  });
}
