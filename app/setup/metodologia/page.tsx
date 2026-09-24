import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";
import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Metodologia e transparência",
  description: "Como o Pereda Dev pretende organizar fontes, preço, compatibilidade e recomendações de tecnologia.",
  path: "/setup/metodologia",
});

export default function MethodologyPage() {
  return (
    <div className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>Setup / metodologia</p>
        <h1>Transparência sobre o que foi verificado.</h1>
        <p className={styles.lead}>Uma recomendação só merece confiança quando deixa claros o contexto, as fontes e os limites do que sabemos.</p>
      </section>
      <article className={`container ${styles.linksSection}`}>
        <section>
          <h2>Estado atual</h2>
          <p>A maioria das fichas continua ilustrativa. A página do Redragon Fizz identifica um modelo e cita fontes do fabricante e do anúncio, mas o produto não foi testado pela equipe e o preço e o estoque não foram verificados. As fichas não devem ser tratadas como recomendações de compra.</p>
        </section>
        <section>
          <h2>Como uma ficha poderá ser publicada como verificada</h2>
          <p>Uma ficha verificada precisará identificar o modelo exato, distinguir dados do fabricante de avaliação editorial, apontar fontes e data de consulta, registrar o preço e a loja quando houver, e explicar público indicado, limites, alternativas e compatibilidade relevante. Teste físico só será declarado quando realmente ocorrer.</p>
        </section>
        <section>
          <h2>Preços e links</h2>
          <p>Preço e disponibilidade podem mudar. O link do Redragon Fizz leva a um anúncio específico, sem preço exibido até que ele seja conferido. Links afiliados podem gerar comissão; isso não substitui os critérios editoriais.</p>
        </section>
        <p><Link href="/setup/transparencia">Leia também a transparência sobre afiliados.</Link></p>
      </article>
    </div>
  );
}
