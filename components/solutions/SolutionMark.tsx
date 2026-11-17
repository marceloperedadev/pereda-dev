import type { SolutionKey } from "@/lib/content/solutions";

import styles from "./SolutionMark.module.css";

type Props = Readonly<{
  kind: SolutionKey;
}>;

/**
 * Marca visual de cada frente.
 *
 * Não é uma captura de projeto: é um diagrama abstrato para que o
 * visitante perceba a diferença entre site, loja e página de links
 * antes de ler o texto.
 */
export function SolutionMark({ kind }: Props) {
  return (
    <span
      className={`${styles.mark} ${styles[kind]}`}
      aria-hidden="true"
    >
      {kind === "sites" ? (
        <span className={styles.browser}>
          <span className={styles.browserBar}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.browserBody}>
            <span className={styles.siteLead} />
            <span className={styles.siteColumns}>
              <i />
              <i />
              <i />
            </span>
          </span>
        </span>
      ) : null}

      {kind === "lojas" ? (
        <span className={styles.shop}>
          <span className={styles.shopTop}>
            <i />
            <i />
          </span>
          <span className={styles.products}>
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className={styles.cart}>
            <b>02</b>
          </span>
        </span>
      ) : null}

      {kind === "links" ? (
        <span className={styles.links}>
          <span className={styles.avatar} />
          <span className={styles.link} />
          <span className={styles.link} />
          <span className={`${styles.link} ${styles.linkAccent}`} />
        </span>
      ) : null}
    </span>
  );
}
