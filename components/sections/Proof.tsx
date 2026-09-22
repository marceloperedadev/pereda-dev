import { Reveal } from "@/components/ui/Reveal";
import { SectionRule } from "@/components/ui/SectionRule";

import { proof } from "@/lib/content/home";

import styles from "./Proof.module.css";

export function Proof() {
  return (
    <section
      className={styles.section}
      aria-labelledby="proof-title"
    >
      <div className="container">
        <SectionRule label="Antes do código" />

        <div className={styles.grid}>
          <Reveal className={styles.head}>
            <header>
              <h2 id="proof-title" className={styles.title}>
                {proof.title}
              </h2>

              <p className={styles.lead}>
                {proof.lead}
              </p>
            </header>
          </Reveal>

          <ul className={styles.list}>
            {proof.items.map((item, index) => (
              <li
                key={item.title}
                className={styles.item}
              >
                <Reveal delay={index * 70}>
                  <h3 className={styles.itemTitle}>
                    {item.title}
                  </h3>

                  <p className={styles.itemText}>
                    {item.text}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}