import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { TrackedLink } from "@/components/ui/TrackedLink";
import { ctaParams, projectParams } from "@/lib/analytics/events";
import { projects, projectPath } from "@/lib/data/projects";

import styles from "./page.module.css";

const captures: Record<string, { src: string; alt: string }> = {
  "mimo-pet": {
    src: "/projects/mimo-pet-live.webp",
    alt: "Captura real da página inicial publicada da Mimo Pet, com apresentação dos serviços e agendamento.",
  },
  "pereda-engenharia": {
    src: "/projects/pereda-engenharia-live.webp",
    alt: "Captura real da página inicial publicada da Pereda Engenharia.",
  },
  "ortoclinica-taubate": {
    src: "/projects/ortoclinica-taubate-live.webp",
    alt: "Captura real da página inicial publicada da Ortoclínica Taubaté.",
  },
};

const featured = projects.filter((project) => project.slug in captures);

export function ProjectGallery() {
  return (
    <div className={styles.projectGallery}>
      {featured.map((project, index) => {
        const capture = captures[project.slug];
        const params = projectParams(
          project,
          ctaParams("links_projects", "Abrir projeto"),
        );

        return (
          <article
            className={styles.projectCard}
            data-featured={index === 0}
            key={project.slug}
          >
            <TrackedLink
              href={project.url}
              className={styles.projectImageLink}
              event="click_project"
              eventParams={params}
              aria-label={`Abrir o site publicado de ${project.name}`}
            >
              <Image
                className={styles.projectImage}
                src={capture.src}
                alt={capture.alt}
                fill
                priority={index === 0}
                sizes={index === 0
                  ? "(max-width: 700px) 92vw, 64vw"
                  : "(max-width: 700px) 92vw, 42vw"}
              />
              <span className={styles.projectImageAction} aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={1.8} />
              </span>
            </TrackedLink>

            <div className={styles.projectCaption}>
              <div>
                <p className={styles.projectType}>
                  {project.type} <span aria-hidden="true">/</span> {project.category}
                </p>
                <TrackedLink
                  href={projectPath(project.slug)}
                  className={styles.projectName}
                  event="click_project"
                  eventParams={projectParams(
                    project,
                    ctaParams("links_projects", "Estudo de caso"),
                  )}
                >
                  {project.name}
                </TrackedLink>
              </div>
              <span className={styles.projectNumber} aria-hidden="true">
                0{index + 1}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
