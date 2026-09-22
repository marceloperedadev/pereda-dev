"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { ProjectCover } from "@/components/ui/ProjectCover";
import { TrackedLink } from "@/components/ui/TrackedLink";

import {
  ctaParams,
  projectParams,
  track,
} from "@/lib/analytics/events";

import type { Project } from "@/lib/data/projects";

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

type DragState = {
  id: number;
  x: number;
  y: number;
  dx: number;
  startedAt: number;
  decided: boolean;
  horizontal: boolean;
};

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
  const suppressClick = useRef(false);

  const drag = useRef<DragState | null>(null);

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

  const resetDrag = useCallback(() => {
    const element = trackRef.current;

    if (!element) {
      return;
    }

    element.style.setProperty(
      "--drag",
      "0px",
    );

    delete element.dataset.dragging;
  }, []);

  const onPointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dx: 0,
      startedAt: performance.now(),
      decided: false,
      horizontal: false,
    };
  };

  const onPointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType === "mouse" &&
      hintRef.current &&
      viewportRef.current
    ) {
      const bounds =
        viewportRef.current.getBoundingClientRect();

      const target = event.target;

      const overControl =
        target instanceof HTMLElement
          ? Boolean(
              target.closest(
                "a, button",
              ),
            )
          : false;

      hintRef.current.style.transform =
        `translate3d(${
          event.clientX -
          bounds.left +
          16
        }px, ${
          event.clientY -
          bounds.top +
          16
        }px, 0)`;

      hintRef.current.dataset.visible =
        overControl
          ? "false"
          : "true";
    }

    const state = drag.current;

    if (
      !state ||
      state.id !== event.pointerId
    ) {
      return;
    }

    const dx =
      event.clientX - state.x;
    const dy =
      event.clientY - state.y;

    if (!state.decided) {
      if (
        Math.abs(dx) < 6 &&
        Math.abs(dy) < 6
      ) {
        return;
      }

      state.decided = true;

      state.horizontal =
        Math.abs(dx) > Math.abs(dy);

      if (state.horizontal) {
        try {
          event.currentTarget.setPointerCapture(
            event.pointerId,
          );
        } catch {
          // Pointer capture is not available
          // in every browser/context.
        }

        if (trackRef.current) {
          trackRef.current.dataset.dragging =
            "true";
        }
      }
    }

    if (!state.horizontal) {
      return;
    }

    state.dx = dx;

    const atStart =
      activeRef.current === 0 &&
      dx > 0;

    const atEnd =
      activeRef.current ===
        total - 1 &&
      dx < 0;

    const displacement =
      atStart || atEnd
        ? dx * 0.3
        : dx;

    trackRef.current?.style.setProperty(
      "--drag",
      `${displacement}px`,
    );
  };

  const endDrag = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const state = drag.current;

    if (
      !state ||
      state.id !== event.pointerId
    ) {
      return;
    }

    drag.current = null;

    if (!state.horizontal) {
      return;
    }

    const elapsed = Math.max(
      1,
      performance.now() -
        state.startedAt,
    );

    const velocity =
      state.dx / elapsed;

    if (
      state.dx < -60 ||
      velocity < -0.5
    ) {
      goTo(
        activeRef.current + 1,
        "drag",
      );
    } else if (
      state.dx > 60 ||
      velocity > 0.5
    ) {
      goTo(
        activeRef.current - 1,
        "drag",
      );
    }

    resetDrag();

    suppressClick.current = true;

    window.setTimeout(() => {
      suppressClick.current = false;
    }, 60);
  };

  const onKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.target !==
        event.currentTarget ||
      total === 0
    ) {
      return;
    }

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();

        goTo(
          activeRef.current + 1,
          "keyboard",
        );

        break;

      case "ArrowLeft":
        event.preventDefault();

        goTo(
          activeRef.current - 1,
          "keyboard",
        );

        break;

      case "Home":
        event.preventDefault();

        goTo(0, "keyboard");

        break;

      case "End":
        event.preventDefault();

        goTo(
          total - 1,
          "keyboard",
        );

        break;

      default:
        break;
    }
  };

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
          if (!suppressClick.current) {
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
          {projects.map(
            (project, index) => {
              const isActive =
                index === active;

              return (
                <div
                  key={project.slug}
                  className={
                    styles.slide
                  }
                  data-active={
                    isActive
                  }
                >
                  <article
                    className={
                      styles.card
                    }
                    inert={!isActive}
                    aria-label={`${project.name} — projeto ${
                      index + 1
                    } de ${total}`}
                  >
                    <div
                      className={
                        styles.media
                      }
                    >
                      <ProjectCover
                        project={
                          project
                        }
                        sizes="(min-width: 1200px) 1100px, 84vw"
                        priority={
                          index === 0
                        }
                      />
                    </div>

                    <div
                      className={
                        styles.info
                      }
                    >
                      <p
                        className={
                          styles.index
                        }
                      >
                        {pad(index + 1)}{" "}
                        /{" "}
                        {pad(total)}
                      </p>

                      <h3
                        className={
                          styles.name
                        }
                      >
                        {project.name}
                      </h3>

                      <p
                        className={
                          styles.category
                        }
                      >
                        {project.category}
                      </p>

                      <p
                        className={
                          styles.summary
                        }
                      >
                        {project.summary}
                      </p>

                      <ul
                        className={
                          styles.tags
                        }
                        aria-label="Características do projeto"
                      >
                        {project.tags.map(
                          (tag) => (
                            <li key={tag}>
                              {tag}
                            </li>
                          ),
                        )}
                      </ul>

                      <TrackedLink
                        href={`/projetos/${project.slug}`}
                        className={
                          styles.cta
                        }
                        event="click_project"
                        eventParams={{
                          ...projectParams(
                            project,
                          ),
                          ...ctaParams(
                            "carousel",
                            "Ver projeto",
                          ),
                          project_position:
                            index +
                            1,
                        }}
                      >
                        Ver projeto

                        <ArrowUpRight
                          size={18}
                          aria-hidden="true"
                        />
                      </TrackedLink>
                    </div>
                  </article>

                  {!isActive ? (
                    <button
                      type="button"
                      className={
                        styles.peek
                      }
                      aria-label={`Ver o projeto ${project.name}`}
                      onClick={() =>
                        goTo(
                          index,
                          "peek",
                        )
                      }
                    />
                  ) : null}
                </div>
              );
            },
          )}
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