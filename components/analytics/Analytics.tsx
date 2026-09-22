"use client";

import Link from "next/link";
import Script from "next/script";

import {
  useEffect,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import {
  CONSENT_EVENT,
  GA_ID,
  analyticsEnabled,
} from "@/lib/analytics/config";

import {
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/analytics/consent";

import { pageview } from "@/lib/analytics/events";

import styles from "./Analytics.module.css";

/**
 * Google Analytics 4 com consentimento.
 *
 * Regras:
 *
 * - sem NEXT_PUBLIC_GA_ID:
 *   nenhum script ou banner é renderizado;
 *
 * - sem escolha do visitante:
 *   o Analytics não é carregado;
 *
 * - com "Aceitar":
 *   o gtag.js é carregado e os page views são enviados
 *   conforme a navegação do App Router;
 *
 * - com "Recusar":
 *   o Analytics permanece desativado.
 */
export function Analytics() {
  const pathname = usePathname();

  const [
    consent,
    setConsent,
  ] = useState<
    ConsentState | "loading"
  >("loading");

  const [ready, setReady] =
    useState(false);

  /**
   * Recupera o consentimento salvo e
   * acompanha alterações feitas pelo banner.
   */
  useEffect(() => {
    const storedConsent =
      readConsent();

    setConsent(storedConsent);

    const handleConsentChange = (
      event: Event,
    ) => {
      const customEvent =
        event as CustomEvent<ConsentState>;

      setConsent(
        customEvent.detail,
      );

      /**
       * Se o visitante recusar depois de
       * já ter aceitado anteriormente,
       * não mantemos o estado de pronto.
       */
      if (
        customEvent.detail !==
        "granted"
      ) {
        setReady(false);
      }
    };

    window.addEventListener(
      CONSENT_EVENT,
      handleConsentChange,
    );

    return () => {
      window.removeEventListener(
        CONSENT_EVENT,
        handleConsentChange,
      );
    };
  }, []);

  /**
   * Envia page_view somente depois que:
   *
   * 1. existe consentimento;
   * 2. o script já está pronto;
   * 3. o gtag global está disponível.
   */
  useEffect(() => {
    if (
      consent !== "granted" ||
      !ready ||
      typeof window === "undefined" ||
      typeof window.gtag !== "function"
    ) {
      return;
    }

    pageview(pathname);
  }, [
    pathname,
    consent,
    ready,
  ]);

  if (!analyticsEnabled) {
    return null;
  }

  const analyticsLoaded =
    consent === "granted";

  return (
    <>
      {analyticsLoaded ? (
        <>
          <Script
            id="ga-init"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;

              gtag('js', new Date());

              gtag('config', '${GA_ID}', {
                send_page_view: false
              });
            `}
          </Script>

          <Script
            id="ga-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
            onReady={() => {
              setReady(
                typeof window !==
                  "undefined" &&
                  typeof window.gtag ===
                    "function",
              );
            }}
          />
        </>
      ) : null}

      {consent === "unset" ? (
        <section
          className={styles.banner}
          aria-label="Preferências de privacidade"
        >
          <div
            className={
              styles.content
            }
          >
            <p
              className={
                styles.text
              }
            >
              Uso o Google Analytics
              para entender como o
              site é utilizado. Nada é
              ativado sem a sua escolha.{" "}
              <Link
                href="/privacidade"
                className={
                  styles.link
                }
              >
                Privacidade
              </Link>
            </p>

            <div
              className={
                styles.actions
              }
            >
              <button
                type="button"
                className={
                  styles.accept
                }
                onClick={() =>
                  writeConsent(
                    "granted",
                  )
                }
              >
                Aceitar
              </button>

              <button
                type="button"
                className={
                  styles.deny
                }
                onClick={() =>
                  writeConsent(
                    "denied",
                  )
                }
              >
                Recusar
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}