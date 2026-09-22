"use client";

import { ArrowUpRight } from "lucide-react";
import {
  useEffect,
  useRef,
  type CSSProperties,
} from "react";

import { ProjectCover } from "@/components/ui/ProjectCover";
import { TrackedLink } from "@/components/ui/TrackedLink";

import {
  ctaParams,
  projectParams,
} from "@/lib/analytics/events";

import type { Project } from "@/lib/data/projects";

import styles from "./HeroVisual.module.css";

type HeroVisualStyle = CSSProperties & {
  "--px": number;
  "--py": number;
};

type LeadProject = Pick<
  Project,
  "name" | "slug" | "category" | "type" | "cover"
>;

type SecondaryProject = Pick<
  Project,
  "name" | "cover"
>;

type Props = {
  lead: LeadProject;
  second: SecondaryProject;
};

export function HeroVisual({
  lead,
  second,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (
      !pointerQuery.matches ||
      reducedMotionQuery.matches
    ) {
      return;
    }

    let frameId: number | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const applyPosition = () => {
      frameId = null;

      element.style.setProperty(
        "--px",
        pointerX.toFixed(3),
      );

      element.style.setProperty(
        "--py",
        pointerY.toFixed(3),
      );
    };

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      const bounds =
        element.getBoundingClientRect();

      if (
        bounds.width === 0 ||
        bounds.height === 0
      ) {
        return;
      }

      pointerX = Math.max(
        -1,
        Math.min(
          1,
          ((event.clientX - bounds.left) /
            bounds.width -
            0.5) *
            2,
        ),
      );

      pointerY = Math.max(
        -1,
        Math.min(
          1,
          ((event.clientY - bounds.top) /
            bounds.height -
            0.5) *
            2,
        ),
      );

      if (frameId === null) {
        frameId =
          window.requestAnimationFrame(
            applyPosition,
          );
      }
    };

    const resetPosition = () => {
      pointerX = 0;
      pointerY = 0;

      if (frameId === null) {
        frameId =
          window.requestAnimationFrame(
            applyPosition,
          );
      }
    };

    element.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true },
    );

    element.addEventListener(
      "pointerleave",
      resetPosition,
    );

    return () => {
      element.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      element.removeEventListener(
        "pointerleave",
        resetPosition,
      );

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const visualStyle: HeroVisualStyle = {
    "--px": 0,
    "--py": 0,
  };

  return (
    <div
      ref={ref}
      className={styles.visual}
      style={visualStyle}
      aria-label={`Projeto em foco: ${lead.name}`}
    >
      <div className={styles.back}>
        <ProjectCover
          project={lead}
          sizes="(min-width: 1200px) 34vw, (min-width: 768px) 46vw, 90vw"
          priority
        />
      </div>

      <div className={styles.front}>
        <ProjectCover
          project={second}
          sizes="(min-width: 1200px) 18vw, (min-width: 768px) 24vw, 34vw"
        />
      </div>

      <div className={styles.caption}>
        <p className={styles.tag}>
          <span
            className={styles.dot}
            aria-hidden="true"
          />
          Projeto em foco
        </p>

        <p className={styles.name}>
          {lead.name}
        </p>

        <p className={styles.cat}>
          {lead.category}
        </p>

        <TrackedLink
          href={`/projetos/${lead.slug}`}
          className={styles.link}
          event="click_project"
          eventParams={{
            ...projectParams(lead),
            ...ctaParams(
              "hero_visual",
              "Ver projeto",
            ),
          }}
        >
          Ver projeto

          <ArrowUpRight
            size={16}
            aria-hidden="true"
          />
        </TrackedLink>
      </div>
    </div>
  );
}