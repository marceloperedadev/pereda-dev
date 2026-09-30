/**
 * Gerenciamento de sessão anônima de analytics.
 *
 * session_id: UUID por aba/janela — vive no sessionStorage
 *             (uma nova sessão é criada a cada vez que o navegador é fechado)
 *
 * visitor_id: UUID por visitante — vive no localStorage
 *             (persiste entre sessões para identificar visitantes recorrentes)
 *             Nunca contém dados pessoais.
 *
 * Nunca armazenamos: nome, e-mail, IP, localização, dados pessoais.
 */

const SESSION_KEY = "pereda_analytics_sid";
const VISITOR_KEY = "pereda_analytics_vid";
let fallbackSessionId: string | undefined;
let fallbackVisitorId: string | undefined;

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback simples para ambientes sem crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Obtém ou cria o session_id (por aba/janela). */
export function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const id = generateId();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    // sessionStorage indisponível (modo incógnito extremo, iframe, etc.)
    fallbackSessionId ??= generateId();
    return fallbackSessionId;
  }
}

/** Obtém ou cria o visitor_id (persiste entre sessões). */
export function getVisitorId(): { id: string; isNew: boolean } {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return { id: existing, isNew: false };

    const id = generateId();
    localStorage.setItem(VISITOR_KEY, id);
    return { id, isNew: true };
  } catch {
    // localStorage indisponível
    if (fallbackVisitorId) return { id: fallbackVisitorId, isNew: false };
    fallbackVisitorId = generateId();
    return { id: fallbackVisitorId, isNew: true };
  }
}

/** Obtém UTMs da URL atual. */
export function getUTMParams(): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
} {
  if (typeof window === "undefined") {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null };
  }

  // Preserva UTMs da landing page na sessionStorage para não perder na navegação interna
  const STORED_UTM_KEY = "pereda_analytics_utms";
  const currentParams = new URLSearchParams(window.location.search);

  const clean = (value: string | null) => {
    const candidate = value?.trim().slice(0, 100) ?? "";
    return candidate && /^[\p{L}\p{N} _.:-]+$/u.test(candidate) ? candidate : null;
  };
  const currentUtm = {
    utm_source: clean(currentParams.get("utm_source")),
    utm_medium: clean(currentParams.get("utm_medium")),
    utm_campaign: clean(currentParams.get("utm_campaign")),
    utm_content: null,
    utm_term: null,
  };

  const hasUTM = Object.values(currentUtm).some(Boolean);

  try {
    if (hasUTM) {
      sessionStorage.setItem(STORED_UTM_KEY, JSON.stringify(currentUtm));
      return currentUtm;
    }

    const stored = sessionStorage.getItem(STORED_UTM_KEY);
    if (stored) {
      const saved = JSON.parse(stored) as Record<string, string | null>;
      const sanitized = {
        utm_source: clean(saved.utm_source ?? null),
        utm_medium: clean(saved.utm_medium ?? null),
        utm_campaign: clean(saved.utm_campaign ?? null),
        utm_content: null,
        utm_term: null,
      };
      sessionStorage.setItem(STORED_UTM_KEY, JSON.stringify(sanitized));
      return sanitized;
    }
  } catch {
    // Falha silenciosa
  }

  return currentUtm;
}
