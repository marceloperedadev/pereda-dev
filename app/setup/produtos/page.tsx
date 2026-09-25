import type { Metadata } from "next";

import { Disclosure } from "@/components/setup/Disclosure";
import { ProductList } from "@/components/setup/ProductList";
import { products } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({ title: "Curadoria de produtos para PC e setup", description: "Produtos apresentados com contexto, perfil de uso, pontos de atenção e motivo da indicação.", path: "/setup/produtos" });

export default function ProductsPage() {
  return (
    <div className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>Curadoria / hardware</p>
        <h1>Escolha a partir do que você precisa resolver.</h1>
        <p className={styles.lead}>Use estas referências para comparar recursos e limites. Confira o modelo, o preço e a disponibilidade na loja antes de decidir.</p>
      </section>
      <section className={`container ${styles.linksSection}`}>
        <ProductList items={products} />
        <Disclosure />
      </section>
    </div>
  );
}
