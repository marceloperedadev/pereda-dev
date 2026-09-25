import { ArrowUpRight } from "lucide-react";

import { ProjectCover } from "@/components/ui/ProjectCover";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ctaParams, projectParams } from "@/lib/analytics/events";
import type { Project } from "@/lib/data/projects";

import styles from "./HeroVisual.module.css";

type Props = {
  lead: Pick<Project, "name" | "slug" | "category" | "type" | "cover">;
};

export function HeroVisual({ lead }: Props) {
  return (
    <figure className={styles.visual}>
      <div className={styles.media}>
        <ProjectCover
          project={lead}
          sizes="(min-width: 1200px) 42vw, (min-width: 768px) 46vw, 90vw"
          priority
        />
      </div>

      <figcaption className={styles.caption}>
        <div className={styles.copy}>
          <p className={styles.tag}>
            <span className={styles.dot} aria-hidden="true" />
            Projeto em destaque
          </p>
          <p className={styles.name}>{lead.name}</p>
          <p className={styles.cat}>{lead.type} · {lead.category}</p>
        </div>

        <TrackedLink
          href={`/projetos/${lead.slug}`}
          className={styles.link}
          event="click_project"
          eventParams={{
            ...projectParams(lead),
            ...ctaParams("hero_visual", "Ver como foi construído"),
          }}
        >
          Ver como foi construído
          <ArrowUpRight size={16} aria-hidden="true" />
        </TrackedLink>
      </figcaption>
    </figure>
  );
}
