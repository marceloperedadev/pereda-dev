import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ctaParams, projectParams } from "@/lib/analytics/events";
import { absoluteUrl } from "@/lib/config/site";
import { projectPath, projects } from "@/lib/data/projects";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import styles from "./page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Projetos de sites, e-commerce e sistemas",
  description:
    "Cases de criação de sites, lojas virtuais e sistemas: Belo Cão, Brasão Burger, Ortoclínica Taubaté e Prospector. Veja o problema, a solução e a execução de cada um.",
  path: "/projetos",
});

export default function ProjectsPage() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([
        { name: "Início", path: "/" },
        { name: "Projetos", path: "/projetos" },
      ]),
      {
        "@type": "CollectionPage",
        name: "Projetos de sites, e-commerce e sistemas",
        url: absoluteUrl("/projetos"),
        inLanguage: "pt-BR",
        hasPart: projects.map((p) => ({ "@type": "CreativeWork", name: p.name, url: absoluteUrl(projectPath(p.slug)) })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <PageHeader
        title="Projetos de sites, lojas virtuais e sistemas"
        lead="Cada projeto começou com um problema de negócio diferente. Aqui está o que precisava ser resolvido e como foi construído."
      />

      <section className={`container ${styles.list}`} aria-label="Lista de projetos">
        {projects.map((p, i) => (
          <article key={p.slug} className={styles.item} data-flip={i % 2 === 1}>
            <Link href={projectPath(p.slug)} className={styles.media} tabIndex={-1} aria-hidden="true">
              <ProjectCover project={p} sizes="(min-width: 1024px) 56vw, 92vw" priority={i === 0} />
            </Link>
            <div className={styles.body}>
              <p className={styles.index}>
                {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </p>
              <h2 className={styles.name}>{p.name}</h2>
              <p className={styles.category}>{p.category}</p>
              <p className={styles.summary}>{p.summary}</p>
              <ul className={styles.tags} aria-label="Serviços do projeto">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <TrackedLink
                href={projectPath(p.slug)}
                className={styles.cta}
                event="click_project"
                eventParams={{ ...projectParams(p), ...ctaParams("projects_page", "Ver projeto") }}
              >
                Ver o projeto {p.name}
                <ArrowUpRight size={18} aria-hidden="true" />
              </TrackedLink>
            </div>
          </article>
        ))}
      </section>

      <Contact location="projects_page" />
    </>
  );
}
