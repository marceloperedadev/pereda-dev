"use client";

import { useEffect, useState } from "react";

import {
  analyticsEnabled,
} from "@/lib/analytics/config";

import {
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/analytics/consent";

import styles from "./ConsentPreferences.module.css";

type ViewState = ConsentState | "loading";

const LABEL: Record<ConsentState, string> = {
  granted: "Você aceitou a medição de audiência.",
  denied: "Você recusou a medição de audiência.",
  unset: "Você ainda não escolheu.",
};

/**
 * Permite rever a escolha de consentimento
 * a qualquer momento na página de privacidade.
 */
export function ConsentPreferences() {
  const [state, setState] =
    useState<ViewState>("loading");

  useEffect(() => {
    setState(readConsent());
  }, []);

  if (!analyticsEnabled) {
    return (
      <p className={styles.note}>
        A medição de audiência não está ativa neste site.
      </p>
    );
  }

  const choose = (next: ConsentState) => {
    writeConsent(next);
    setState(next);
  };

  const currentState =
    state === "loading" ? "unset" : state;

  return (
    <div className={styles.box}>
      <p
        className={styles.note}
        aria-live="polite"
      >
        {state === "loading"
          ? "Verificando sua preferência..."
          : LABEL[currentState]}
      </p>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => choose("granted")}
          disabled={state === "loading"}
        >
          Aceitar
        </button>

        <button
          type="button"
          className={styles.btn}
          onClick={() => choose("denied")}
          disabled={state === "loading"}
        >
          Recusar
        </button>
      </div>
    </div>
  );
}