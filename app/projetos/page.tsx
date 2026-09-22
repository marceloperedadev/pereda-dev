import Link from "next/link";

import { ProjectCover } from "@/components/ui/ProjectCover";
import { projects, projectPath } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Projetos — Marcelo Felipe | Desenvolvedor Full Stack",
  description:
    "Projetos de sites profissionais, e-commerce e sistemas web desenvolvidos por Marcelo Felipe, desenvolvedor Full Stack em Taubaté, SP.",
  path: "/projetos",
});

export default function ProjetosPage() {
  return (
    <main>
      <section aria-labelledby="projetos-title">
        <div className="container">
          <p className={styles.index}>PROJETOS</p>

          <h1 id="projetos-title" className={styles.name}>
            Projetos que mostram
            <br />
            o que eu construo.
          </h1>

          <p className={styles.summary}>
            Uma seleção de trabalhos desenvolvidos para diferentes tipos de
            negócios, com foco em experiência, estrutura, performance e
            funcionamento real.
          </p>
        </div>
      </section>

      <section aria-labelledby="projetos-lista-title">
        <div className="container">
          <header>
            <p className={styles.index}>SELEÇÃO</p>

            <h2 id="projetos-lista-title" className={styles.category}>
              Projetos em movimento
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
                    sizes="(min-width: 901px) 58vw, 100vw"
                    priority={index < 2}
                  />
                </Link>

                <div className={styles.body}>
                  <span className={styles.index}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className={styles.name}>{project.name}</h3>

                  <p className={styles.category}>
                    {project.type} / {project.category}
                  </p>

                  <p className={styles.summary}>
                    {project.shortDescription}
                  </p>

                  <ul
                    className={styles.tags}
                    aria-label={`Tecnologias e características do projeto ${project.name}`}
                  >
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>

                  <div>
                    <Link
                      href={projectPath(project.slug)}
                      className={styles.cta}
                    >
                      Ver projeto
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
                        Visitar site
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}