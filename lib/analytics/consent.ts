import {
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  GA_ID,
} from "./config";

export type ConsentState =
  | "granted"
  | "denied"
  | "unset";

/**
 * Lê a preferência de analytics armazenada no navegador.
 */
export function readConsent(): ConsentState {
  if (typeof window === "undefined") {
    return "unset";
  }

  try {
    const value = window.localStorage.getItem(
      CONSENT_STORAGE_KEY,
    );

    if (
      value === "granted" ||
      value === "denied"
    ) {
      return value;
    }

    return "unset";
  } catch {
    return "unset";
  }
}

/**
 * Aplica o bloqueio/desbloqueio de coleta do Google Analytics.
 *
 * O mecanismo ga-disable-* é reconhecido pelo Google Analytics
 * para impedir a coleta quando a preferência do visitante não
 * permite analytics.
 */
function applyAnalyticsConsent(
  state: ConsentState,
): void {
  if (typeof window === "undefined") return;
  if (!GA_ID) return;

  const key = `ga-disable-${GA_ID}`;

  (
    window as unknown as Record<string, unknown>
  )[key] = state !== "granted";
}

/**
 * Persiste a preferência do visitante e notifica
 * componentes interessados na alteração.
 */
export function writeConsent(
  state: ConsentState,
): void {
  if (typeof window === "undefined") return;

  try {
    if (state === "unset") {
      window.localStorage.removeItem(
        CONSENT_STORAGE_KEY,
      );
    } else {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        state,
      );
    }
  } catch {
    /**
     * Se o armazenamento estiver indisponível,
     * a preferência continua válida apenas durante
     * o ciclo atual da página.
     */
  }

  applyAnalyticsConsent(state);

  window.dispatchEvent(
    new CustomEvent<ConsentState>(
      CONSENT_EVENT,
      {
        detail: state,
      },
    ),
  );
}

/**
 * Inicializa o estado de bloqueio do Analytics
 * a partir da preferência atualmente armazenada.
 *
 * Deve ser executado antes ou durante a inicialização
 * do carregamento do GA.
 */
export function initializeConsent(): ConsentState {
  const state = readConsent();

  applyAnalyticsConsent(state);

  return state;
}