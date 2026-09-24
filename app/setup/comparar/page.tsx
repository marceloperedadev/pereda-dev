import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";
import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Comparativos de hardware",
  description: "Comparativos de hardware com fontes, diferenças e contexto de uso.",
  path: "/setup/comparar",
  index: false,
});

export default function ComparePage() {
  return (
    <div className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>Comparativos / em preparação</p>
        <h1>Comparar com dados verificáveis.</h1>
        <p className={styles.lead}>Ainda não há comparativos publicados. Eles serão disponibilizados quando houver modelos identificados, fontes e contexto suficientes para explicar as diferenças.</p>
        <Link href="/setup/metodologia">Conheça a metodologia ↗</Link>
      </section>
    </div>
  );
}
