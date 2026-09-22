"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import { TrackedLink } from "@/components/ui/TrackedLink";
import { ctaParams } from "@/lib/analytics/events";
import { siteConfig } from "@/lib/config/site";

import styles from "./Header.module.css";

const NAV = [
  {
    href: "/projetos",
    label: "Projetos",
  },
  {
    href: "/sobre",
    label: "Sobre",
  },
  {
    href: "/contato",
    label: "Contato",
  },
] as const;

export function Header() {
  const pathname = usePathname();

  const [open, setOpen] =
    useState(false);

  /**
   * Fecha o menu quando a rota muda.
   */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /**
   * Permite fechar o menu com Escape.
   */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div
        className={`container ${styles.inner}`}
      >
        <Link
          href="/"
          className={styles.brand}
          aria-label={`${siteConfig.name} — página inicial`}
        >
          <span
            className={styles.mark}
            aria-hidden="true"
          />

          <span>
            {siteConfig.name}
          </span>
        </Link>

        <nav
          className={styles.nav}
          aria-label="Navegação principal"
        >
          <ul
            className={styles.list}
            id="menu-principal"
            data-open={open}
          >
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`,
                );

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.link}
                    aria-current={
                      active
                        ? "page"
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

            <li
              className={
                styles.ctaItem
              }
            >
              <TrackedLink
                href="/contato"
                className={styles.cta}
                event="start_contact"
                eventParams={ctaParams(
                  "header",
                  "Iniciar um projeto",
                )}
              >
                Iniciar um projeto
              </TrackedLink>
            </li>
          </ul>

          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="menu-principal"
            aria-label={
              open
                ? "Fechar menu"
                : "Abrir menu"
            }
            onClick={() =>
              setOpen(
                (current) => !current,
              )
            }
          >
            <span
              className={styles.bars}
              aria-hidden="true"
              data-open={open}
            />
          </button>
        </nav>
      </div>
    </header>
  );
}