import Link from "next/link";

import { ProjectCover } from "@/components/ui/ProjectCover";
import { projects, projectPath } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Cases — Marcelo Felipe | Desenvolvimento Web e E-commerce",
  description:
    "Cases de desenvolvimento de sites, lojas virtuais e sistemas web construídos por Marcelo Felipe para diferentes tipos de negócios.",
  path: "/projetos",
});

export default function ProjetosPage() {
  return (
    <main>
      <section className={styles.intro} aria-labelledby="projetos-title">
        <div className="container">
          <p className={styles.index}>PROJETOS</p>

          <h1 id="projetos-title" className={styles.pageTitle}>
            Projetos que mostram
            o que eu construo.
          </h1>

          <p className={styles.introLead}>
            Uma seleção de trabalhos desenvolvidos para diferentes tipos de
            negócios, com foco em experiência, estrutura, performance e
            objetivos de cada projeto.
          </p>
        </div>
      </section>

      <section
        className={`container ${styles.collection}`}
        aria-labelledby="projetos-lista-title"
      >
        <header className={styles.collectionHead}>
          <p className={styles.index}>SELEÇÃO</p>

          <h2 id="projetos-lista-title" className={styles.sectionTitle}>
            Cada projeto, por dentro
          </h2>
        </header>

        <div className={styles.list}>
          {projects.map((project, index) => (
              <article
                key={project.slug}
                className={styles.item}
                data-flip={index % 2 === 1 ? "true" : undefined}
              >
                <Link
                  href={projectPath(project.slug)}
                  className={styles.media}
                  aria-label={`Ver detalhes do projeto ${project.name}`}
                >
                  <ProjectCover
                    project={project}
                    sizes="(min-width: 901px) 58vw, 92vw"
                    priority={index === 0}
                  />
                </Link>

                <div className={styles.body}>
                  <span className={styles.index}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className={styles.projectName}>{project.name}</h3>

                  <p className={styles.category}>
                    {project.type} / {project.category}
                  </p>

                  <p className={styles.projectSummary}>
                    {project.shortDescription}
                  </p>

                  <ul
                    className={styles.stack}
                    aria-label={`Tecnologias utilizadas no projeto ${project.name}`}
                  >
                    {project.stack.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>

                  <div className={styles.actions}>
                    <Link
                      href={projectPath(project.slug)}
                      className={styles.cta}
                    >
                      Conhecer projeto
                      <span aria-hidden="true">↗</span>
                    </Link>

                    {project.url ? (
                      <a
                        href={project.url}
                        className={styles.cta}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visitar o site do projeto ${project.name} em nova aba`}
                      >
                        Ver experiência no ar
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
          ))}
        </div>
      </section>
    </main>
  );
}
