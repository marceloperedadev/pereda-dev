"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { TrackedLink } from "@/components/ui/TrackedLink";
import { ctaParams } from "@/lib/analytics/events";
import { siteConfig } from "@/lib/config/site";

import styles from "./Header.module.css";

const NAV = [
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
] as const;

type Theme = "dark" | "light";

export function Header() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  /*
   * Inicializa o tema salvo ou respeita
   * a preferência do sistema.
   */
  useEffect(() => {
    const savedTheme = window.localStorage.getItem(
      "pereda-theme",
    ) as Theme | null;

    const systemPrefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;

    const initialTheme: Theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : systemPrefersLight
          ? "light"
          : "dark";

    document.documentElement.dataset.theme = initialTheme;

    setTheme(initialTheme);
  }, []);

  /*
   * Alterna entre os dois temas
   * e mantém a escolha salva.
   */
  const toggleTheme = () => {
    const nextTheme: Theme =
      theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;

    window.localStorage.setItem(
      "pereda-theme",
      nextTheme,
    );

    setTheme(nextTheme);
  };

  /*
   * Fecha o menu ao mudar de página.
   */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /*
   * Fecha o menu com Escape.
   */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
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
      <div className={`container ${styles.inner}`}>
        <Link
          href="/"
          className={styles.brand}
          aria-label={`${siteConfig.name} — página inicial`}
        >
          <span
            className={styles.mark}
            aria-hidden="true"
          >
            P
          </span>

          <span className={styles.brandName}>
            {siteConfig.name}
          </span>
        </Link>

        <div className={styles.headerMeta}>
          <span className={styles.metaLine}>
            FULL STACK
          </span>

          <span className={styles.metaSeparator}>
            /
          </span>

          <span className={styles.metaLine}>
            EXPERIÊNCIAS DIGITAIS
          </span>
        </div>

        <nav
          className={styles.nav}
          aria-label="Navegação principal"
        >
          <ul
            className={styles.list}
            id="menu-principal"
            data-open={open}
          >
            {NAV.map((item, index) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.link}
                    aria-current={
                      active ? "page" : undefined
                    }
                  >
                    <span className={styles.linkIndex}>
                      0{index + 1}
                    </span>

                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}

            <li className={styles.ctaItem}>
              <TrackedLink
                href="/contato"
                className={styles.cta}
                event="start_contact"
                eventParams={ctaParams(
                  "header",
                  "Iniciar um projeto",
                )}
              >
                <span>Iniciar um projeto</span>

                <span
                  className={styles.ctaArrow}
                  aria-hidden="true"
                >
                  ↗
                </span>
              </TrackedLink>
            </li>
          </ul>

          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Ativar tema claro"
                : "Ativar tema escuro"
            }
            title={
              theme === "dark"
                ? "Tema claro"
                : "Tema escuro"
            }
          >
            <span
              className={styles.themeIcon}
              data-theme={theme}
              aria-hidden="true"
            />
          </button>

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
              setOpen((current) => !current)
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