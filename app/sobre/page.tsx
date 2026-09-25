import type { Metadata } from "next";
import Link from "next/link";

import { AboutPortrait } from "@/components/ui/AboutPortrait";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";

import { ctaParams } from "@/lib/analytics/events";
import { about, process } from "@/lib/content/home";
import { projectPath, projects } from "@/lib/data/projects";
import { aboutGraph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { whatsappUrl } from "@/lib/utils/contact";

import styles from "./page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Sobre Marcelo Felipe — Desenvolvimento Web e E-commerce",
  description:
    "Conheça Marcelo Felipe, desenvolvedor web e especialista em e-commerce em Taubaté, SP. Veja como trabalha e os sites e sistemas que constrói.",
  path: "/sobre",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutGraph()} />

      <section className={`container ${styles.grid}`} aria-labelledby="about-title">
        <div className={styles.portrait}>
          <AboutPortrait priority />
        </div>

        <header className={styles.intro}>
          <p className={styles.eyebrow}>Marcelo Felipe · Taubaté, SP</p>

          <h1 id="about-title" className={styles.title}>
            Desenvolvimento web & e-commerce
          </h1>

          <div className={styles.paras}>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </header>
      </section>

      <section
        className={`container ${styles.section}`}
        aria-labelledby="likes-title"
      >
        <h2 id="likes-title" className={styles.h2}>
          Projetos que gosto de construir
        </h2>

        <ul className={styles.list}>
          {about.likes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section
        className={`container ${styles.section}`}
        aria-labelledby="way-title"
      >
        <h2 id="way-title" className={styles.h2}>
          Como eu trabalho
        </h2>

        <ol className={styles.steps}>
          {process.steps.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3>{step.title}</h3>
                <p>{step.tagline}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={`container ${styles.section}`}
        aria-labelledby="see-title"
      >
        <h2 id="see-title" className={styles.h2}>
          Veja como isso aparece nos projetos
        </h2>

        <ul className={styles.links}>
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={projectPath(project.slug)}>
                {project.name}
              </Link>

              <span>{project.category}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className={`container ${styles.cta}`}
        aria-labelledby="about-cta"
      >
        <h2 id="about-cta" className={styles.ctaTitle}>
          Vamos conversar sobre o seu projeto?
        </h2>

        <div className={styles.actions}>
          <ButtonLink
            href={whatsappUrl()}
            variant="primary"
            arrow
            event="click_whatsapp"
            eventParams={ctaParams("about_page", "Vamos conversar")}
          >
            Vamos conversar
          </ButtonLink>

          <ButtonLink
            href="/projetos"
            variant="text"
            event="click_project"
            eventParams={ctaParams("about_page", "Conhecer projetos")}
          >
            Conhecer projetos
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
