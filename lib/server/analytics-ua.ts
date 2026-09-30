import "server-only";

/**
 * Parser de User-Agent — sem dependências externas.
 *
 * Detecta:
 * - Tipo de dispositivo: desktop | mobile | tablet
 * - Sistema operacional: Windows, macOS, Linux, iOS, Android, ChromeOS
 * - Navegador: Chrome, Firefox, Safari, Edge, Opera, Samsung Browser
 *
 * O User-Agent é processado no servidor e descartado após a extração.
 * Nunca armazenamos o UA bruto.
 */

export type ParsedUA = {
  deviceType: "desktop" | "mobile" | "tablet";
  os: string;
  browser: string;
};

export function parseUserAgent(ua: string): ParsedUA {
  if (!ua) {
    return { deviceType: "desktop", os: "Unknown", browser: "Unknown" };
  }

  // --- Tipo de dispositivo ---
  const isMobile = /mobile|iphone|ipod|blackberry|windows phone|android.*mobi/i.test(ua);
  const isTablet = /ipad|android(?!.*mobile)|tablet|kindle|silk|playbook/i.test(ua);

  const deviceType: "desktop" | "mobile" | "tablet" = isTablet
    ? "tablet"
    : isMobile
      ? "mobile"
      : "desktop";

  // --- Sistema operacional ---
  let os = "Unknown";

  if (/windows phone/i.test(ua)) {
    os = "Windows Phone";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    const match = ua.match(/OS (\d+)[_ ](\d+)/);
    os = match ? `iOS ${match[1]}.${match[2]}` : "iOS";
  } else if (/android/i.test(ua)) {
    const match = ua.match(/Android ([0-9.]+)/);
    os = match ? `Android ${match[1]}` : "Android";
  } else if (/cros/i.test(ua)) {
    os = "ChromeOS";
  } else if (/windows nt/i.test(ua)) {
    const match = ua.match(/Windows NT ([0-9.]+)/);
    if (match) {
      const version = parseFloat(match[1]);
      if (version >= 10) os = "Windows 10+";
      else if (version >= 6.3) os = "Windows 8.1";
      else if (version >= 6.2) os = "Windows 8";
      else if (version >= 6.1) os = "Windows 7";
      else os = "Windows";
    } else {
      os = "Windows";
    }
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  // --- Navegador ---
  let browser = "Unknown";

  // Ordem importa: verificar mais específicos primeiro
  if (/edg\//i.test(ua)) {
    browser = "Edge";
  } else if (/opr\//i.test(ua) || /opera/i.test(ua)) {
    browser = "Opera";
  } else if (/samsungbrowser/i.test(ua)) {
    browser = "Samsung Browser";
  } else if (/ucbrowser/i.test(ua)) {
    browser = "UC Browser";
  } else if (/firefox\//i.test(ua)) {
    browser = "Firefox";
  } else if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) {
    browser = "Chrome";
  } else if (/chromium/i.test(ua)) {
    browser = "Chromium";
  } else if (/safari\//i.test(ua) && !/chrome/i.test(ua)) {
    browser = "Safari";
  }

  return { deviceType, os, browser };
}

/**
 * Determina a origem do tráfego a partir do referrer e UTMs.
 *
 * Retorna um identificador simples para agrupar fontes:
 * direct | google | instagram | facebook | linkedin | whatsapp | twitter | referral | <domínio>
 */
export function parseTrafficSource(referrer: string | null, utmSource?: string | null): string {
  if (utmSource) return utmSource.toLowerCase().trim();
  if (!referrer) return "direct";

  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();

    if (!hostname) return "direct";

    // Redes sociais e buscadores conhecidos
    if (/google\./i.test(hostname)) return "google";
    if (/bing\./i.test(hostname)) return "bing";
    if (/instagram\.com/i.test(hostname)) return "instagram";
    if (/facebook\.com|fb\.com|m\.facebook/i.test(hostname)) return "facebook";
    if (/linkedin\.com/i.test(hostname)) return "linkedin";
    if (/whatsapp\.com|web\.whatsapp/i.test(hostname)) return "whatsapp";
    if (/twitter\.com|t\.co|x\.com/i.test(hostname)) return "twitter";
    if (/youtube\.com|youtu\.be/i.test(hostname)) return "youtube";
    if (/tiktok\.com/i.test(hostname)) return "tiktok";
    if (/pinterest\./i.test(hostname)) return "pinterest";

    // Remove www. e retorna domínio limpo
    return hostname.replace(/^www\./, "");
  } catch {
    return "direct";
  }
}

/**
 * Extrai parâmetros UTM de uma URL.
 */
export function extractUTMParams(url: string): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
} {
  try {
    const parsed = new URL(url);
    return {
      utm_source: parsed.searchParams.get("utm_source"),
      utm_medium: parsed.searchParams.get("utm_medium"),
      utm_campaign: parsed.searchParams.get("utm_campaign"),
      utm_content: parsed.searchParams.get("utm_content"),
      utm_term: parsed.searchParams.get("utm_term"),
    };
  } catch {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    };
  }
}

/**
 * Anonimiza o IP: mantém apenas os primeiros octetos.
 *
 * IPv4: 192.168.1.1 → 192.168.1.0
 * IPv6: 2001:db8::1 → 2001:db8::
 *
 * Usado apenas para rate limiting — o resultado NÃO é armazenado.
 */
export function anonymizeIp(ip: string): string {
  if (!ip) return "";

  // IPv6
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.slice(0, 4).join(":") + "::";
  }

  // IPv4
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }

  return ip;
}
