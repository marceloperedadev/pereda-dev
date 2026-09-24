import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";
import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Transparência sobre afiliados",
  description: "Como funcionam os links de afiliado e a curadoria do hub Setup do Pereda Dev.",
  path: "/setup/transparencia",
});

export default function TransparencyPage() {
  return (
    <div className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>Transparência</p>
        <h1>Curadoria antes da comissão.</h1>
        <p className={styles.lead}>As fichas disponíveis são ilustrativas. No momento, não há ofertas afiliadas verificadas nem preços conferidos neste hub.</p>
      </section>
      <section className={`container ${styles.linksSection}`}>
        <h2>Quando houver links afiliados</h2>
        <p>Um link será identificado como afiliado e poderá gerar uma comissão sem custo adicional para você. A existência de comissão não será apresentada como evidência de qualidade ou adequação do produto.</p>
        <p>Preços e estoque mudam. A página deverá indicar a data de verificação e levar ao produto específico para que você confirme as condições na loja.</p>
        <p><Link href="/setup/metodologia">Leia a metodologia e os limites atuais da curadoria ↗</Link></p>
      </section>
    </div>
  );
}
