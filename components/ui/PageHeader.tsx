import type { ReactNode } from "react";

import styles from "./PageHeader.module.css";

type Props = Readonly<{
  title: string;
  lead?: string;
  children?: ReactNode;
  id?: string;
}>;

export function PageHeader({
  title,
  lead,
  children,
  id = "page-title",
}: Props) {
  return (
    <header
      className={`container ${styles.header}`}
    >
      <h1
        id={id}
        className={styles.title}
      >
        {title}
      </h1>

      {lead ? (
        <p className={styles.lead}>
          {lead}
        </p>
      ) : null}

      {children}
    </header>
  );
}