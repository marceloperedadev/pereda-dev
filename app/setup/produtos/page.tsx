import type { Metadata } from "next";
import Link from "next/link";

import { Disclosure } from "@/components/setup/Disclosure";
import { ProductList } from "@/components/setup/ProductList";
import { productsWithMercadoLivreLinks } from "@/lib/data/setup";
import { getProductImageMap, getSetupProductListings } from "@/lib/server/setup-product-listings";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({ title: "Curadoria de produtos para PC e setup", description: "Produtos apresentados com contexto, perfil de uso, pontos de atenção e motivo da indicação.", path: "/setup/produtos" });

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const listings = await getSetupProductListings(productsWithMercadoLivreLinks);
  const productImages = getProductImageMap(listings);
  const productsWithImages = productsWithMercadoLivreLinks.map((product) => ({
    ...product,
    image: productImages[product.id] ?? product.image,
  }));

  return (
    <div className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>Curadoria / hardware</p>
        <h1>Escolha a partir do que você precisa resolver.</h1>
        <p className={styles.lead}>Use estas referências para comparar recursos e limites. Confira o modelo, o preço e a disponibilidade na loja antes de decidir.</p>
      </section>
      <section className={`container ${styles.linksSection}`}>
        <div className={styles.comparisonCallout}>
          <div>
            <p className={styles.sectionLabel}>Comparação em destaque / monitores</p>
            <h2>100 Hz ou 144 Hz?</h2>
            <p>Veja dois anúncios Full HD lado a lado, com fotos do Mercado Livre quando disponíveis e os limites dos dados claramente identificados.</p>
          </div>
          <Link href="/setup/comparar">Abrir comparação ↗</Link>
        </div>
        <ProductList items={productsWithImages} />
        <Disclosure />
      </section>
    </div>
  );
}
