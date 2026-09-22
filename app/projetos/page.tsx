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
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="projetos-title">
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>PROJETOS</p>

          <h1 id="projetos-title" className={styles.title}>
            Projetos que mostram
            <br />
            o que eu construo.
          </h1>

          <p className={styles.intro}>
            Uma seleção de trabalhos desenvolvidos para diferentes tipos de
            negócios, com foco em experiência, estrutura, performance e
            funcionamento real.
          </p>
        </div>
      </section>

      <section
        className={styles.projects}
        aria-labelledby="projetos-lista-title"
      >
        <div className={styles.projectsInner}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>SELEÇÃO</p>

            <h2 id="projetos-lista-title" className={styles.sectionTitle}>
              Projetos em movimento
            </h2>
          </div>

          <div className={styles.grid}>
            {projects.map((p, index) => (
              <article className={styles.card} key={p.slug}>
                <Link
                  href={projectPath(p.slug)}
                  className={styles.coverLink}
                  aria-label={`Ver detalhes do projeto ${p.name}`}
                >
                  <ProjectCover
                    project={p}
                    sizes="(min-width: 1100px) 50vw, (min-width: 700px) 50vw, 100vw"
                    priority={index < 2}
                  />
                </Link>

                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span>{p.type}</span>
                    <span aria-hidden="true">/</span>
                    <span>{p.category}</span>
                  </div>

                  <h2 className={styles.name}>{p.name}</h2>

                  <p className={styles.category}>{p.category}</p>

                  <p className={styles.summary}>{p.shortDescription}</p>

                  <ul
                    className={styles.tags}
                    aria-label={`Tecnologias e características do projeto ${p.name}`}
                  >
                    {p.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>

                  <div className={styles.actions}>
                    <Link
                      href={projectPath(p.slug)}
                      className={styles.detailsLink}
                    >
                      Ver projeto
                      <span aria-hidden="true">↗</span>
                    </Link>

                    {p.url ? (
                      <a
                        href={p.url}
                        className={styles.externalLink}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Visitar o site do projeto ${p.name} em nova aba`}
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