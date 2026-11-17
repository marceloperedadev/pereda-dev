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
            <div className={styles.projectActions}>
              <TrackedLink
                href={project.url}
                className={styles.cta}
                target="_blank"
                rel="noopener noreferrer"
                event="click_project"
                eventParams={{
                  ...projectParams(project),
                  ...ctaParams("carousel", "Abrir projeto publicado"),
                  project_position: index + 1,
                }}
              >
                Abrir projeto publicado
                <ArrowUpRight size={18} aria-hidden="true" />
              </TrackedLink>
              <TrackedLink
                href={`/projetos/${project.slug}`}
                className={styles.caseLink}
                event="click_project"
                eventParams={{
                  ...projectParams(project),
                  ...ctaParams("carousel", "Ler estudo de caso"),
                  project_position: index + 1,
                }}
              >
                Ler estudo de caso
              </TrackedLink>
            </div>
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
