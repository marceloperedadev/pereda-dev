import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { ProjectViewTracker } from "@/components/analytics/ProjectViewTracker";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { TrackedLink } from "@/components/ui/TrackedLink";

import { ctaParams, projectParams } from "@/lib/analytics/events";
import {
  getProject,
  otherProjects,
  projectPath,
  projects,
} from "@/lib/data/projects";
import { projectGraph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  projectWhatsappMessage,
  whatsappUrl,
} from "@/lib/utils/contact";

import styles from "./page.module.css";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {};
  }

  return buildMetadata({
    title: `${project.name}: ${project.type.toLowerCase()}`,
    description: project.shortDescription,
    path: projectPath(project.slug),
    type: "article",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const others = otherProjects(project.slug);
  const projectAnalyticsParams = projectParams(project);

  return (
    <>
      <JsonLd data={projectGraph(project)} />

      <ProjectViewTracker
        name={project.name}
        type={project.type}
      />

      <article aria-labelledby="case-title">
        <div className={`container ${styles.top}`}>
          <nav
            aria-label="Navegação estrutural"
            className={styles.crumbs}
          >
            <ol>
              <li>
                <Link href="/">Início</Link>
              </li>

              <li>
                <Link href="/projetos">Projetos</Link>
              </li>

              <li aria-current="page">
                {project.name}
              </li>
            </ol>
          </nav>

          <header className={styles.header}>
            <h1 id="case-title" className={styles.title}>
              {project.h1}
            </h1>

            <p className={styles.summary}>
              {project.shortDescription}
            </p>
          </header>
        </div>

        <div className={`container ${styles.coverWrap}`}>
          <div className={styles.cover}>
            <ProjectCover
              project={project}
              sizes="(min-width: 1360px) 1300px, 92vw"
              priority
            />
          </div>
        </div>

        <div className={`container ${styles.meta}`}>
          <dl className={styles.metaList}>
            <div>
              <dt>Categoria</dt>
              <dd>{project.category}</dd>
            </div>

            <div>
              <dt>Tipo de projeto</dt>
              <dd>{project.type}</dd>
            </div>

            <div>
              <dt>Tecnologias</dt>
              <dd>{project.stack.join(", ")}</dd>
            </div>

            {project.url ? (
              <div>
                <dt>Projeto no ar</dt>

                <dd>
                  <TrackedLink
                    href={project.url}
                    className={styles.ext}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visitar o projeto ${project.name} em uma nova aba`}
                    event="project_cta_click"
                    eventParams={{
                      ...projectAnalyticsParams,
                      ...ctaParams(
                        "project_meta",
                        "Visitar projeto",
                      ),
                    }}
                  >
                    Visitar
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                    />
                  </TrackedLink>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className={`container ${styles.body}`}>
          <section
            className={styles.block}
            aria-labelledby="problema"
          >
            <h2 id="problema" className={styles.h2}>
              O problema
            </h2>

            <p className={styles.lede}>
              {project.problem}
            </p>
          </section>

          <section
            className={styles.block}
            aria-labelledby="solucao"
          >
            <h2 id="solucao" className={styles.h2}>
              A solução
            </h2>

            <p className={styles.lede}>
              {project.solution}
            </p>
          </section>

          <section
            className={styles.block}
            aria-labelledby="execucao"
          >
            <h2 id="execucao" className={styles.h2}>
              A execução
            </h2>

            <p className={styles.lede}>
              {project.execution}
            </p>
          </section>

          <section
            className={styles.block}
            aria-labelledby="funcionalidades"
          >
            <h2 id="funcionalidades" className={styles.h2}>
              Funcionalidades
            </h2>

            <ul className={styles.list}>
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>

          <section
            className={styles.block}
            aria-labelledby="decisoes"
          >
            <h2 id="decisoes" className={styles.h2}>
              Decisões de projeto
            </h2>

            <ul className={styles.list}>
              {project.decisions.map((decision) => (
                <li key={decision}>{decision}</li>
              ))}
            </ul>
          </section>

          <section
            className={styles.block}
            aria-labelledby="objetivo"
          >
            <h2 id="objetivo" className={styles.h2}>
              Objetivo do projeto
            </h2>

            <p className={styles.lede}>
              {project.objective}
            </p>
          </section>
        </div>

        <aside
          className={`container ${styles.cta}`}
          aria-labelledby="case-cta"
        >
          <h2 id="case-cta" className={styles.ctaTitle}>
            Gostou desse tipo de projeto?
          </h2>

          <div className={styles.ctaActions}>
            <ButtonLink
              href={whatsappUrl(
                projectWhatsappMessage(project.name),
              )}
              variant="primary"
              arrow
              event="click_whatsapp"
              eventParams={{
                ...projectAnalyticsParams,
                ...ctaParams(
                  "project_page",
                  "Vamos conversar",
                ),
              }}
            >
              Vamos conversar
            </ButtonLink>

            <ButtonLink
              href="/sobre"
              variant="text"
              event="project_cta_click"
              eventParams={{
                ...projectAnalyticsParams,
                ...ctaParams(
                  "project_page",
                  "Conhecer o desenvolvedor",
                ),
              }}
            >
              Quem está por trás
            </ButtonLink>
          </div>
        </aside>
      </article>

      <section
        className={`container ${styles.more}`}
        aria-labelledby="more-title"
      >
        <h2 id="more-title" className={styles.moreTitle}>
          Outros projetos
        </h2>

        <ul className={styles.moreList}>
          {others.map((other) => (
            <li key={other.slug}>
              <TrackedLink
                href={projectPath(other.slug)}
                className={styles.moreLink}
                event="click_project"
                eventParams={{
                  ...projectParams(other),
                  ...ctaParams(
                    "project_more",
                    "Outro projeto",
                  ),
                }}
              >
                <span className={styles.moreName}>
                  {other.name}
                </span>

                <span className={styles.moreCat}>
                  {other.category}
                </span>

                <ArrowUpRight
                  size={20}
                  aria-hidden="true"
                />
              </TrackedLink>
            </li>
          ))}
        </ul>

        <p className={styles.moreFoot}>
          <Link href="/projetos">
            Ver todos os projetos
          </Link>{" "}
          ·{" "}
          <Link href="/contato">
            Falar sobre o seu projeto
          </Link>
        </p>
      </section>
    </>
  );
}
