"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { projects, projectPath } from "@/lib/data/projects";
import { ProjectCover } from "@/components/ui/ProjectCover";

import styles from "./page.module.css";

type Accent = React.CSSProperties & { "--pc-accent": string; "--dir": number };
const pad = (n: number) => String(n).padStart(2, "0");
const SWIPE = 48;

/**
 * Carrossel editorial. Quatro formas de navegar, todas visíveis:
 * setas, lista (seleção direta), arrasto/toque e teclado (← →).
 * O ponteiro (só mouse) move imagem e nome em profundidades diferentes.
 */
export function SelectedWorks() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const start = useRef<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const n = projects.length;
  const p = projects[i];
  const next = projects[(i + 1) % n];

  const go = (to: number, d?: 1 | -1) => {
    const t = (to + n) % n;
    if (t === i) return;
    setDir(d ?? (to > i ? 1 : -1));
    setI(t);
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    stage.current.style.setProperty(
      "--px",
      String(((e.clientX - r.left) / r.width - 0.5) * 2),
    );
    stage.current.style.setProperty(
      "--py",
      String(((e.clientY - r.top) / r.height - 0.5) * 2),
    );
  };
  const onLeave = () => {
    stage.current?.style.setProperty("--px", "0");
    stage.current?.style.setProperty("--py", "0");
  };

  return (
    <section
      className={styles.work}
      id="obras"
      aria-roledescription="carrossel"
      aria-label="Obras selecionadas"
      style={{ "--pc-accent": p.cover.art.accent, "--dir": dir } as Accent}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1, 1);
        if (e.key === "ArrowLeft") go(i - 1, -1);
      }}
    >
      <div className={styles.workHead}>
        <h2 className={styles.workTitle}>
          Obras
          <br />
          selecionadas
        </h2>
        <div className={styles.ctrl}>
          <p className={styles.count} aria-hidden="true">
            <b>{pad(i + 1)}</b> / {pad(n)}
          </p>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => go(i - 1, -1)}
            aria-label="Obra anterior"
          >
            <ArrowLeft size={22} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => go(i + 1, 1)}
            aria-label="Próxima obra"
          >
            <ArrowRight size={22} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={stage}
        className={styles.stage}
        onPointerDown={(e) => {
          start.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (start.current === null) return;
          const dx = e.clientX - start.current;
          start.current = null;
          if (dx < -SWIPE) go(i + 1, 1);
          else if (dx > SWIPE) go(i - 1, -1);
        }}
        onPointerCancel={() => {
          start.current = null;
        }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {n > 1 && (
          <button
            type="button"
            className={styles.peek}
            onClick={() => go(i + 1, 1)}
            aria-label={`Próxima obra: ${next.name}`}
            tabIndex={-1}
          >
          <ProjectCover project={next} sizes="40vw" />
          </button>
        )}
        <div key={p.slug} className={styles.cur}>
          <div className={styles.curImg}>
            <ProjectCover
              project={p}
              sizes="(max-width: 768px) 92vw, 62vw"
              priority={i === 0}
            />
          </div>
          <h3 className={styles.curName}>{p.name}</h3>
        </div>
      </div>

      <div key={`i${p.slug}`} className={styles.info}>
        <p className={styles.infoNo}>
          Obra {pad(i + 1)} · {p.category}
        </p>
        <p className={styles.infoType}>{p.type}</p>
        <p className={styles.infoDesc}>{p.shortDescription}</p>
        <Link href={projectPath(p.slug)} className={styles.go}>
          Visitar {p.name}{" "}
          <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </div>

      <ol className={styles.list} aria-label="Escolher obra">
        {projects.map((q, k) => (
          <li key={q.slug}>
            <button
              type="button"
              onClick={() => go(k)}
              aria-current={k === i ? "true" : undefined}
              style={{ "--pc-accent": q.cover.art.accent } as Accent}
            >
              <span>{pad(k + 1)}</span>
              <b>{q.name}</b>
              <small>{q.category}</small>
            </button>
          </li>
        ))}
      </ol>
      <p className={styles.hint}>
        Arraste a imagem, use as setas ou escolha na lista.
      </p>
      <p className={styles.vh} aria-live="polite">
        Obra {i + 1} de {n}: {p.name}
      </p>
    </section>
  );
}

export default SelectedWorks;
