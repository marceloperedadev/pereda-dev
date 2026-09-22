/**
 * Configuração central do Google Analytics.
 *
 * O ID deve ser fornecido exclusivamente pela variável:
 *
 * NEXT_PUBLIC_GA_ID
 *
 * Exemplo:
 *
 * NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *
 * Sem um ID válido:
 * - o Analytics permanece desativado;
 * - nenhum evento é enviado;
 * - nenhum banner de consentimento relacionado ao GA
 *   deve ser exibido pelo restante da aplicação.
 */

const rawGAId =
  process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";

/**
 * Aceita somente IDs no formato utilizado pelo GA4.
 *
 * Mantemos a validação restritiva para evitar que conteúdo
 * inesperado da variável de ambiente seja inserido no fluxo
 * de carregamento do Analytics.
 */
export const GA_ID: string =
  /^G-[A-Z0-9]{4,}$/.test(rawGAId)
    ? rawGAId
    : "";

export const analyticsEnabled =
  GA_ID.length > 0;

/**
 * Chave usada para armazenar a preferência de analytics
 * no navegador.
 *
 * A versão permite alterar a política futuramente sem
 * conflitar automaticamente com uma preferência antiga.
 */
export const CONSENT_STORAGE_KEY =
  "pereda_analytics_consent_v1";

/**
 * Evento interno utilizado para avisar componentes React
 * quando a preferência de analytics foi alterada.
 */
export const CONSENT_EVENT =
  "pereda:consent-change";