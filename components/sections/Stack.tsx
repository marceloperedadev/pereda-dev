import { Reveal } from "@/components/ui/Reveal";

import { stack } from "@/lib/content/home";

import styles from "./Stack.module.css";

export function Stack() {
  return (
    <section
      className={styles.section}
      aria-labelledby="stack-title"
    >
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.copy}>
          <header>
            <h2 id="stack-title" className={styles.title}>
              {stack.title}
            </h2>

            <p className={styles.lead}>
              {stack.lead}
            </p>
          </header>
        </Reveal>

        <ul
          className={styles.list}
          aria-label="Tecnologias e recursos utilizados nos projetos"
        >
          {stack.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}