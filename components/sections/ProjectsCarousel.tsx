"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  ctaParams,
  projectParams,
  track,
} from "@/lib/analytics/events";

import type { Project } from "@/lib/data/projects";

import { ProjectCarouselSlide } from "./ProjectCarouselSlide";
import { useProjectsCarouselDrag } from "./useProjectsCarouselDrag";
import { useProjectsCarouselKeyboard } from "./useProjectsCarouselKeyboard";
import styles from "./ProjectsCarousel.module.css";

export type CarouselProject = {
  slug: string;
  name: string;
  category: string;
  type: string;
  summary: string;
  tags: readonly string[];
  cover: Project["cover"];
};

type Interaction =
  | "auto"
  | "arrow"
  | "drag"
  | "keyboard"
  | "indicator"
  | "peek";

type TrackStyle = CSSProperties & {
  "--i": number;
};

const pad = (value: number) =>
  String(value).padStart(2, "0");

export function ProjectsCarousel({
  projects,
}: {
  projects: CarouselProject[];
}) {
  const total = projects.length;

  const [active, setActive] = useState(0);

  const activeRef = useRef(0);
  const viewportRef =
    useRef<HTMLDivElement>(null);
  const trackRef =
    useRef<HTMLDivElement>(null);
  const hintRef =
    useRef<HTMLSpanElement>(null);

  const seenInitialView = useRef(false);
  const [suppressClick, setSuppressClick] = useState(false);

  useEffect(() => {
    const nextActive =
      total === 0
        ? 0
        : Math.max(
            0,
            Math.min(total - 1, active),
          );

    activeRef.current = nextActive;

    if (nextActive !== active) {
      setActive(nextActive);
    }
  }, [active, projects, total]);

  const goTo = useCallback(
    (
      index: number,
      interaction: Interaction,
    ) => {
      if (total === 0) {
        return;
      }

      const next = Math.max(
        0,
        Math.min(total - 1, index),
      );

      if (next === activeRef.current) {
        return;
      }

      activeRef.current = next;
      setActive(next);

      const project = projects[next];

      if (!project) {
        return;
      }

      track(
        "view_project",
        projectParams(project, {
          project_position: next + 1,
          interaction,
        }),
      );
    },
    [projects, total],
  );

  useEffect(() => {
    const element = viewportRef.current;

    if (
      !element ||
      total === 0 ||
      typeof IntersectionObserver ===
        "undefined"
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          if (
            entries.some(
              (entry) =>
                entry.isIntersecting,
            ) &&
            !seenInitialView.current
          ) {
            seenInitialView.current =
              true;

            const project =
              projects[
                activeRef.current
              ];

            if (project) {
              track(
                "view_project",
                projectParams(project, {
                  project_position:
                    activeRef.current + 1,
                  interaction: "auto",
                }),
              );
            }

            observer.disconnect();
          }
        },
        {
          threshold: 0.5,
        },
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [projects, total]);

  const {
    onPointerDown,
    onPointerMove,
    endDrag,
    shouldSuppressClick,
  } = useProjectsCarouselDrag({
    total,
    activeRef,
    trackRef,
    viewportRef,
    hintRef,
    goTo: (index, interaction) => goTo(index, interaction),
    setSuppressClick,
  });

  const onKeyDown = useProjectsCarouselKeyboard({
    total,
    activeRef,
    goTo: (index, interaction) => goTo(index, interaction),
  });

  if (total === 0) {
    return null;
  }

  const trackStyle: TrackStyle = {
    "--i": active,
  };

  return (
    <div className={styles.wrap}>
      <div
        className={`container ${styles.bar}`}
      >
        <p
          className={styles.counter}
          aria-hidden="true"
        >
          <span
            className={styles.current}
          >
            {pad(active + 1)}
          </span>

          <span
            className={styles.total}
          >
            {" "}
            / {pad(total)}
          </span>
        </p>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() =>
              goTo(
                active - 1,
                "arrow",
              )
            }
            disabled={active === 0}
            aria-label="Projeto anterior"
          >
            <ArrowLeft
              size={20}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className={styles.arrow}
            onClick={() =>
              goTo(
                active + 1,
                "arrow",
              )
            }
            disabled={
              active === total - 1
            }
            aria-label="Próximo projeto"
          >
            <ArrowRight
              size={20}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Projetos em destaque"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          if (hintRef.current) {
            hintRef.current.dataset.visible =
              "false";
          }
        }}
        onDragStart={(event) =>
          event.preventDefault()
        }
        onClickCapture={(event) => {
          if (!suppressClick && !shouldSuppressClick()) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div
          ref={trackRef}
          className={styles.track}
          style={trackStyle}
        >
          {projects.map((project, index) => (
            <ProjectCarouselSlide
              key={project.slug}
              project={project}
              index={index}
              total={total}
              isActive={index === active}
              onSelect={(next, interaction) =>
                goTo(next, interaction)
              }
            />
          ))}
        </div>

        <span
          ref={hintRef}
          className={styles.hint}
          data-visible="false"
          aria-hidden="true"
        >
          Arraste
        </span>
      </div>

      <div
        className={`container ${styles.dots}`}
        role="group"
        aria-label="Escolher projeto"
      >
        {projects.map(
          (project, index) => (
            <button
              key={project.slug}
              type="button"
              className={styles.dot}
              aria-label={`Ir para o projeto ${project.name}`}
              aria-current={
                index === active
                  ? "true"
                  : undefined
              }
              onClick={() =>
                goTo(
                  index,
                  "indicator",
                )
              }
            />
          ),
        )}
      </div>

      <p
        className="srOnly"
        aria-live="polite"
        aria-atomic="true"
      >
        Projeto {active + 1} de {total}:{" "}
        {projects[active]?.name}
      </p>
    </div>
  );
}