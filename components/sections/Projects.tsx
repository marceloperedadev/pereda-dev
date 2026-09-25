import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionRule } from "@/components/ui/SectionRule";

import { ctaParams } from "@/lib/analytics/events";
import { projectsSection } from "@/lib/content/home";
import { projects } from "@/lib/data/projects";

import {
  ProjectsCarousel,
  type CarouselProject,
} from "./ProjectsCarousel";

import styles from "./Projects.module.css";

export function Projects() {
  const featuredProjectSlug = "mimo-pet";
  const items: CarouselProject[] = projects
    .filter((project) => project.slug !== featuredProjectSlug)
    .map((project) => ({
      slug: project.slug,
      name: project.name,
      category: project.category,
      type: project.type,
      summary: project.shortDescription,
      stack: project.stack,
      cover: project.cover,
    }));

  return (
    <section
      id="projetos"
      className={styles.section}
      aria-labelledby="projects-title"
    >
      <div className="container">
        <SectionRule
          label="Projetos"
          meta={`${items.length} cases em destaque`}
        />

        <header className={styles.head}>
          <h2
            id="projects-title"
            className={styles.title}
          >
            {projectsSection.title}
          </h2>

          <p className={styles.lead}>
            {projectsSection.lead}
          </p>
        </header>
      </div>

      <ProjectsCarousel projects={items} />

      <div
        className={`container ${styles.foot}`}
      >
        <ButtonLink
          href="/projetos"
          variant="text"
          arrow
          event="click_project"
          eventParams={ctaParams(
            "projects_section",
            "Ver todos os projetos",
          )}
        >
          Ver todos os projetos
        </ButtonLink>
      </div>
    </section>
  );
}
