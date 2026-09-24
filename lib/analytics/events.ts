import { analyticsEnabled } from "./config";

/**
 * Catálogo central de eventos do portfólio.
 *
 * Funil principal:
 * page_view
 *   ↓
 * view_project
 *   ↓
 * click_project
 *   ↓
 * project_view
 *   ↓
 * project_cta_click
 *   ↓
 * click_whatsapp / click_email
 *
 * Eventos de navegação e profundidade também são registrados
 * quando configurados no restante da aplicação.
 */
export type EventName =
  | "page_view"
  | "view_project"
  | "click_project"
  | "project_view"
  | "project_cta_click"
  | "click_whatsapp"
  | "click_email"
  | "click_linkedin"
  | "click_github"
  | "start_contact"
  | "submit_contact"
  | "scroll_50"
  | "scroll_75"
  | "scroll_90"
  | "setup_search"
  | "setup_filter"
  | "setup_guide_step"
  | "setup_guide_complete"
  | "setup_content_view"
  | "setup_product_view"
  | "setup_product_click"
  | "setup_affiliate_click";

export type EventParams = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Remove parâmetros indefinidos antes do envio.
 *
 * Isso evita mandar campos vazios para o GA4 e mantém
 * os relatórios mais consistentes.
 */
function cleanParams(params: EventParams): EventParams {
  const clean: EventParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }

  return clean;
}

/**
 * Envia um evento para o Google Analytics.
 *
 * O envio somente acontece quando:
 * - o analytics está configurado;
 * - estamos no navegador;
 * - o gtag já foi carregado.
 *
 * A decisão de consentimento permanece centralizada na
 * configuração/carregamento do Google Analytics.
 */
export function track(
  name: EventName,
  params: EventParams = {},
): void {
  if (!analyticsEnabled) return;
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  const clean = cleanParams(params);

  window.gtag("event", name, clean);
}

/**
 * Registra uma visualização de página.
 *
 * Deve ser chamado somente quando a rota efetivamente mudar,
 * evitando pageviews duplicados em navegações internas.
 */
export function pageview(path: string): void {
  if (!analyticsEnabled) return;
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  const cleanPath =
    path.startsWith("/") ? path : `/${path}`;

  track("page_view", {
    page_path: cleanPath,
    page_location: window.location.href,
    page_title: document.title,
    page_referrer: document.referrer || undefined,
  });
}

/**
 * Parâmetros padrão para eventos relacionados a projetos.
 */
export function projectParams(
  project: {
    name: string;
    type: string;
  },
  extra: EventParams = {},
): EventParams {
  return {
    project_name: project.name,
    project_category: project.type,
    ...extra,
  };
}

/**
 * Parâmetros padrão para CTAs.
 */
export function ctaParams(
  location: string,
  name: string,
  extra: EventParams = {},
): EventParams {
  return {
    cta_location: location,
    cta_name: name,
    ...extra,
  };
}
