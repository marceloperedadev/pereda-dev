import { ButtonLink } from "@/components/ui/ButtonLink";

import { ctaParams } from "@/lib/analytics/events";
import { hero } from "@/lib/content/home";
import { getProject } from "@/lib/data/projects";
import { whatsappUrl } from "@/lib/utils/contact";

import { HeroVisual } from "./HeroVisual";
import styles from "./Hero.module.css";

export function Hero() {
  const leadProject = getProject("mimo-pet");

  return (
    <section
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.identity}>
            <span className={styles.dot} aria-hidden="true" />

            <span>{hero.identity}</span>

            <span className={styles.place}>{hero.location}</span>
          </p>

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line}>
              <span className={styles.lineInner}>
                {hero.headlineLead}
              </span>
            </span>{" "}
            <span className={styles.line}>
              <span
                className={`${styles.lineInner} ${styles.tail}`}
              >
                {hero.headlineTail}
              </span>
            </span>
          </h1>

          <p className={styles.text}>{hero.text}</p>

          <div className={styles.actions}>
            <ButtonLink
              href="#projetos"
              variant="primary"
              arrow
              event="click_project"
              eventParams={ctaParams("hero", hero.primaryCta)}
            >
              {hero.primaryCta}
            </ButtonLink>

            <ButtonLink
              href={whatsappUrl()}
              variant="text"
              event="click_whatsapp"
              eventParams={ctaParams("hero", hero.secondaryCta)}
            >
              {hero.secondaryCta}
            </ButtonLink>
          </div>

        </div>

        {leadProject ? (
          <HeroVisual lead={leadProject} />
        ) : null}
      </div>
    </section>
  );
}
