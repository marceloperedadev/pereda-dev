"use client";

import { useEffect, useId, useRef, useState } from "react";
import { List, X } from "lucide-react";

import styles from "./PageIndex.module.css";

const SECTIONS = [
  { id: "frentes", label: "Frentes de trabalho" },
  { id: "problema", label: "O problema" },
  { id: "segmentos", label: "Para quem é" },
  { id: "experiencia", label: "Demonstração" },
  { id: "diferenciais", label: "Diferenciais" },
  { id: "processo", label: "Como funciona" },
  { id: "investimento", label: "Escopo e contratação" },
  { id: "perguntas", label: "Perguntas" },
] as const;

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Índice compacto para telas pequenas.
 *
 * A página comercial é longa; sem isso, o visitante no celular
 * dependeria da rolagem para descobrir os capítulos. O índice
 * é explícito, fecha ao escolher e não intercepta o restante
 * da navegação.
 */
export function PageIndex() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };

    const onPointer = (event: PointerEvent) => {
      const node = root.current;

      if (node && !node.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={root}>
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X size={16} strokeWidth={1.9} aria-hidden="true" />
        ) : (
          <List size={16} strokeWidth={1.9} aria-hidden="true" />
        )}
        Índice
      </button>

      <div
        id={panelId}
        className={styles.panel}
        data-open={open}
        hidden={!open}
      >
        <p className={styles.label}>Capítulos</p>

        <nav aria-label="Seções desta página">
          {SECTIONS.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setOpen(false)}
            >
              <span className={styles.no}>{pad(index + 1)}</span>
              {section.label}
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
