"use client";

import { ArrowUpRight } from "lucide-react";

import { ProjectCover } from "@/components/ui/ProjectCover";
import { TrackedLink } from "@/components/ui/TrackedLink";
import {
  ctaParams,
  projectParams,
} from "@/lib/analytics/events";

import type { CarouselProject } from "./ProjectsCarousel";
import styles from "./ProjectsCarousel.module.css";

const pad = (value: number) => String(value).padStart(2, "0");

type ProjectCarouselSlideProps = {
  project: CarouselProject;
  index: number;
  total: number;
  isActive: boolean;
  onSelect: (
    index: number,
    interaction: "peek",
  ) => void;
};

export function ProjectCarouselSlide({
  project,
  index,
  total,
  isActive,
  onSelect,
}: ProjectCarouselSlideProps) {
  return (
    <div
      className={styles.slide}
      data-active={isActive}
    >
      <article
        className={styles.card}
        inert={!isActive}
        aria-label={`${project.name} — projeto ${index + 1} de ${total}`}
      >
        <div className={styles.media}>
          <ProjectCover
            project={project}
            sizes="(min-width: 1440px) 1280px, 88vw"
          />
        </div>

        <div className={styles.info}>
          <div className={styles.copy}>
            <p className={styles.index}>
              CASE {pad(index + 1)} / {pad(total)}
            </p>
            <h3 className={styles.name}>{project.name}</h3>
            <p className={styles.category}>
              {project.type} · {project.category}
            </p>
            <p className={styles.summary}>{project.summary}</p>
          </div>
          <div className={styles.details}>
            <p className={styles.stackLabel}>Construído com</p>
            <ul
              className={styles.stack}
              aria-label={`Tecnologias utilizadas em ${project.name}`}
            >
              {project.stack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <TrackedLink
              href={`/projetos/${project.slug}`}
              className={styles.cta}
              event="click_project"
              eventParams={{
                ...projectParams(project),
                ...ctaParams("carousel", "Ver como foi construído"),
                project_position: index + 1,
              }}
            >
              Ver como foi construído
              <ArrowUpRight size={18} aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>
      </article>

      {!isActive ? (
        <button
          type="button"
          className={styles.peek}
          aria-label={`Ver o projeto ${project.name}`}
          onClick={() => onSelect(index, "peek")}
        />
      ) : null}
    </div>
  );
}
