import { SectionRule } from "@/components/ui/SectionRule";

import { process } from "@/lib/content/home";

import { ProcessList } from "./ProcessList";
import styles from "./Process.module.css";

export function Process() {
  return (
    <section
      className={styles.section}
      aria-labelledby="process-title"
    >
      <div className="container">
        <SectionRule label="Processo" meta="4 etapas" />

        <div className={styles.layout}>
          <header className={styles.head}>
            <h2 id="process-title" className={styles.title}>
              {process.title}
            </h2>

            <p className={styles.lead}>{process.lead}</p>
          </header>

          <ProcessList steps={process.steps} />
        </div>
      </div>
    </section>
  );
}