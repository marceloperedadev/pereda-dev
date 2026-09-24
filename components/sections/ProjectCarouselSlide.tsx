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
            sizes="(min-width: 1200px) 1100px, 84vw"
            priority={index === 0}
          />
        </div>

        <div className={styles.info}>
          <p className={styles.index}>
            {pad(index + 1)} / {pad(total)}
          </p>
          <h3 className={styles.name}>{project.name}</h3>
          <p className={styles.category}>{project.category}</p>
          <p className={styles.summary}>{project.summary}</p>
          <ul
            className={styles.tags}
            aria-label="Características do projeto"
          >
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <TrackedLink
            href={`/projetos/${project.slug}`}
            className={styles.cta}
            event="click_project"
            eventParams={{
              ...projectParams(project),
              ...ctaParams("carousel", "Ver projeto"),
              project_position: index + 1,
            }}
          >
            Ver projeto
            <ArrowUpRight size={18} aria-hidden="true" />
          </TrackedLink>
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
