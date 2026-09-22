import { AboutPortrait } from "@/components/ui/AboutPortrait";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionRule } from "@/components/ui/SectionRule";

import { ctaParams } from "@/lib/analytics/events";
import { about } from "@/lib/content/home";

import styles from "./About.module.css";

export function About() {
  return (
    <section
      id="sobre"
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className="container">
        <SectionRule label="Quem está por trás" />

        <div className={styles.grid}>
          <div className={styles.portrait}>
            <AboutPortrait />
          </div>

          <Reveal className={styles.copy}>
            <header>
              <h2 id="about-title" className={styles.title}>
                {about.title}
              </h2>

              <p className={styles.role}>{about.role}</p>
            </header>

            <div className={styles.paras}>
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <ul
              className={styles.likes}
              aria-label="Tipos de projeto que gosto de construir"
            >
              {about.likes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <ButtonLink
              href="/sobre"
              variant="text"
              arrow
              event="click_project"
              eventParams={ctaParams("about_section", "Conhecer mais")}
            >
              Conhecer mais
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}