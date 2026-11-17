"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { TrackedLink } from "@/components/ui/TrackedLink";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { ctaParams, projectParams } from "@/lib/analytics/events";
import { projects, projectPath } from "@/lib/data/projects";

import styles from "./page.module.css";

type Props = Readonly<{
  active: number;
  direction: 1 | -1;
  onSelect: (index: number, direction: 1 | -1) => void;
}>;

type AccentStyle = CSSProperties & { "--pc-accent": string };
type DragStyle = CSSProperties & { "--drag-x": string };
type RowStyle = CSSProperties & { "--row-accent": string };

const pad = (value: number) => String(value).padStart(2, "0");
const SWIPE = 48;

function Artwork({
  project,
  priority = false,
}: {
  project: (typeof projects)[number];
  priority?: boolean;
}) {
  return (
    <div className={styles.artwork}>
      <ProjectCover
        project={project}
        sizes="(max-width: 899px) 94vw, 58vw"
        priority={priority}
      />
    </div>
  );
}

export function SelectedWorks({ active, direction, onSelect }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const drag = useRef<{
    x: number;
    y: number;
    active: boolean;
  } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const total = projects.length;
  const project = projects[active];
  const previous = projects[(active - 1 + total) % total];
  const next = projects[(active + 1) % total];

  useEffect(() => {
    return () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  const go = (raw: number, forced?: 1 | -1) => {
    const target = (raw + total) % total;

    if (target === active) return;

    const forward =
      forced ??
      (target === active + 1 || (active === total - 1 && target === 0)
        ? 1
        : -1);

    onSelect(target, forward);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || drag.current) return;

    const node = stage.current;

    if (!node || frame.current !== null) return;

    const x = event.clientX;
    const y = event.clientY;

    frame.current = requestAnimationFrame(() => {
      frame.current = null;

      const rect = node.getBoundingClientRect();

      node.style.setProperty("--mx", String((x - rect.left) / rect.width - 0.5));
      node.style.setProperty("--my", String((y - rect.top) / rect.height - 0.5));
    });
  };

  const resetPointer = () => {
    stage.current?.style.setProperty("--mx", "0");
    stage.current?.style.setProperty("--my", "0");
  };

  const onDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    drag.current = {
      x: event.clientX,
      y: event.clientY,
      active: false,
    };

    setDragX(0);
    setDragging(false);
  };

  const onDragMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;

    if (!state) return;

    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;

    if (!state.active) {
      if (Math.abs(dx) <= 8 || Math.abs(dx) <= Math.abs(dy)) return;

      state.active = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    setDragX(dx);
  };

  const onDragEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;

    if (!state) return;

    const dx = event.clientX - state.x;

    drag.current = null;
    setDragX(0);
    setDragging(false);

    if (!state.active) return;

    if (dx <= -SWIPE) go(active + 1, 1);
    else if (dx >= SWIPE) go(active - 1, -1);
  };

  const onDragCancel = () => {
    drag.current = null;
    setDragX(0);
    setDragging(false);
  };

  return (
    <section
      id="obras"
      className={styles.work}
      aria-labelledby="works-title"
      aria-roledescription="carrossel"
      data-dir={direction}
      style={
        {
          "--pc-accent": project.cover.art.accent,
        } as AccentStyle
      }
    >
      <div className={styles.workHead}>
        <div className={styles.workTitleWrap}>
          <p className={styles.workKicker}>03 — Seleção de trabalhos</p>
          <h2 id="works-title" className={styles.workTitle}>
            <span>Obras</span>
            <em>selecionadas</em>
          </h2>
        </div>

        <div className={styles.workControls}>
          <p className={styles.workCount} aria-hidden="true">
            <b>{pad(active + 1)}</b>
            <span>/ {pad(total)}</span>
          </p>

          <div className={styles.workArrows}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => go(active - 1, -1)}
              aria-label="Obra anterior"
              title="Obra anterior (←)"
            >
              <ArrowLeft size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => go(active + 1, 1)}
              aria-label="Próxima obra"
              title="Próxima obra (→)"
            >
              <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.workProgress} aria-hidden="true">
            {projects.map((item, index) => (
              <span key={item.slug} data-active={index === active} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.workBody}>
        <div className={styles.stageWrap}>
          <div
            ref={stage}
            className={styles.stage}
            role="group"
            tabIndex={0}
            aria-roledescription="palco da obra"
            aria-label={`Obra ${active + 1} de ${total}: ${project.name}`}
            aria-describedby="works-hint"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                go(active + 1, 1);
              }

              if (event.key === "ArrowLeft") {
                event.preventDefault();
                go(active - 1, -1);
              }
            }}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
          >
            <div
              className={styles.ghostPrev}
              aria-hidden="true"
              style={
                {
                  "--pc-accent": previous.cover.art.accent,
                } as AccentStyle
              }
            >
              <ProjectCover project={previous} sizes="24vw" />
            </div>

            <button
              type="button"
              className={styles.ghostNext}
              onClick={() => go(active + 1, 1)}
              aria-label={`Próxima obra: ${next.name}`}
              style={
                {
                  "--pc-accent": next.cover.art.accent,
                } as AccentStyle
              }
            >
              <ProjectCover project={next} sizes="30vw" />
              <span aria-hidden="true">
                Próxima
                <ArrowUpRight size={13} strokeWidth={1.8} />
              </span>
            </button>

            <div
              className={styles.current}
              data-dragging={dragging}
              style={{ "--drag-x": `${dragX}px` } as DragStyle}
              onPointerDown={onDragStart}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
              onPointerCancel={onDragCancel}
            >
              <div key={project.slug} className={styles.currentInner}>
                <div className={styles.currentFrame}>
                  <Artwork project={project} priority={active === 0} />
                </div>

                <span className={styles.sweep} aria-hidden="true" />

                <span className={styles.stageMark} aria-hidden="true" />

                <h3 className={styles.currentName}>
                  <span>{project.name}</span>
                </h3>
              </div>
            </div>
          </div>

          <div className={styles.stageFoot}>
            <p>
              Prancha {pad(active + 1)} — {project.name}
            </p>
            <p id="works-hint">
              Arraste, use <kbd>←</kbd> <kbd>→</kbd> ou escolha na lista.
            </p>
          </div>
        </div>

        <aside className={styles.workSide} aria-label="Detalhes da obra">
          <div key={`info-${project.slug}`} className={styles.workInfo}>
            <p className={styles.infoKicker}>
              <span>Obra {pad(active + 1)}</span>
              <span>{project.category}</span>
            </p>

            <p className={styles.infoType}>{project.type}</p>
            <p className={styles.infoDesc}>{project.shortDescription}</p>

            <div className={styles.infoActions}>
              <TrackedLink
                href={project.url}
                className={styles.infoOpen}
                event="click_project"
                eventParams={projectParams(
                  project,
                  ctaParams("links_obras", "Abrir projeto original"),
                )}
                aria-label={`Abrir o projeto ${project.name} em uma nova aba`}
              >
                Abrir projeto original
                <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
              </TrackedLink>

              <TrackedLink
                href={projectPath(project.slug)}
                className={styles.infoCase}
                event="click_project"
                eventParams={projectParams(
                  project,
                  ctaParams("links_obras", "Estudo de caso"),
                )}
              >
                Ler o estudo de caso
              </TrackedLink>
            </div>
          </div>

          <ol className={styles.workList} aria-label="Escolher obra">
            {projects.map((item, index) => (
              <li key={item.slug}>
                <button
                  type="button"
                  onClick={() =>
                    onSelect(index, index >= active ? 1 : -1)
                  }
                  aria-current={index === active ? "true" : undefined}
                  style={
                    {
                      "--row-accent": item.cover.art.accent,
                    } as RowStyle
                  }
                >
                  <span className={styles.rowNo}>{pad(index + 1)}</span>
                  <span className={styles.rowName}>{item.name}</span>
                  <span className={styles.rowCategory}>{item.category}</span>
                  <span className={styles.rowMark} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <p className={styles.vh} aria-live="polite">
        Obra {active + 1} de {total}: {project.name}
      </p>
    </section>
  );
}
