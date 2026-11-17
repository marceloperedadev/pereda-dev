import { ArrowUpRight } from "lucide-react";

import { TrackedLink } from "@/components/ui/TrackedLink";
import { ctaParams } from "@/lib/analytics/events";

import styles from "./DemoPreview.module.css";

export function DemoPreview() {
  return (
    <div className={styles.widget}>
      <div className={styles.stage}>
        <header className={styles.stageHead}>
          <p>
            <span className={styles.stageDot} aria-hidden="true" />
            Demonstração real
          </p>
          <p>Pereda Dev</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className={styles.pickerLabel}>Um projeto próprio</p>
            <h3>Esta é a presença digital da Pereda Dev.</h3>
            <p className={styles.pickerHint}>
              Explore a experiência real e veja como uma página de links pode
              apresentar projetos, canais de contato e a identidade da marca.
            </p>
            <TrackedLink
              href="/links/pereda-dev"
              className={styles.stageCta}
              event="click_demo_link"
              eventParams={ctaParams("demo", "Abrir experiência Pereda Dev")}
            >
              Abrir experiência completa
              <ArrowUpRight size={15} strokeWidth={1.9} aria-hidden="true" />
            </TrackedLink>
          </div>

          <div className={styles.panel}>
            <iframe
              className={styles.liveFrame}
              src="/links/pereda-dev"
              title="Experiência real da Pereda Dev em uma janela interativa"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
