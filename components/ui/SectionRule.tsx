import styles from "./SectionRule.module.css";

type Props = Readonly<{
  label: string;
  meta?: string;
}>;

/**
 * Filete editorial decorativo que marca o início de uma seção.
 *
 * O conteúdo é ocultado da árvore de acessibilidade porque
 * os títulos reais das seções já fornecem a informação
 * necessária para navegação por leitores de tela.
 */
export function SectionRule({
  label,
  meta,
}: Props) {
  return (
    <div
      className={styles.rule}
      aria-hidden="true"
    >
      <span className={styles.label}>
        <span
          className={styles.dot}
          aria-hidden="true"
        />
        {label}
      </span>

      {meta ? (
        <span className={styles.meta}>
          {meta}
        </span>
      ) : null}
    </div>
  );
}