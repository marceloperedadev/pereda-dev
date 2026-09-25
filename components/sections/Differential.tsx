import { SectionRule } from "@/components/ui/SectionRule";

import { differential } from "@/lib/content/home";
import { siteConfig } from "@/lib/config/site";

import styles from "./Differential.module.css";

export function Differential() {
  return (
    <section
      className={styles.section}
      aria-labelledby="diff-title"
    >
      <div className="container">
        <SectionRule label="Serviços" />

        <div className={styles.layout}>
          <header className={styles.head}>
            <h2 id="diff-title" className={styles.title}>
              {differential.servicesTitle}
            </h2>

            <p className={styles.lead}>
              {differential.servicesLead}
            </p>
          </header>

          <ul className={styles.services}>
            {siteConfig.commercial.offerings.map((offering, index) => (
              <li key={offering.name} className={styles.service}>
                <span className={styles.index} aria-hidden="true">
                  0{index + 1}
                </span>

                <div className={styles.serviceCopy}>
                  <p className={styles.context}>{offering.context}</p>
                  <h3 className={styles.serviceName}>{offering.name}</h3>
                  <p className={styles.description}>{offering.description}</p>
                </div>

                <p className={styles.price}>{offering.price}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
