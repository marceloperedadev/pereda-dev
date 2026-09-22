import Image from "next/image";

import { siteConfig } from "@/lib/config/site";

import styles from "./AboutPortrait.module.css";

/**
 * Retrato editorial.
 *
 * Enquanto não houver uma foto configurada em siteConfig.photo,
 * apresenta um monograma visual sem adicionar conteúdo redundante
 * à árvore de acessibilidade.
 */
export function AboutPortrait({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <div className={styles.frame}>
      {siteConfig.photo ? (
        <Image
          src={siteConfig.photo}
          alt={siteConfig.photoAlt}
          fill
          sizes="(min-width: 1024px) 34vw, 90vw"
          priority={priority}
          className={styles.photo}
        />
      ) : (
        <div
          className={styles.mono}
          aria-hidden="true"
        >
          <span className={styles.letters}>MF</span>
          <span
            className={styles.signal}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}