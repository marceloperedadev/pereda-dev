import type { Metadata } from "next";

import { ProductList } from "@/components/setup/ProductList";
import { productsByPriority } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({ title: "Curadoria de produtos para PC e setup", description: "Produtos apresentados com contexto, perfil de uso, pontos de atenção e motivo da indicação.", path: "/setup/produtos" });

export default function ProductsPage() { return <div className={styles.page}><section className={`container ${styles.hero}`}><p className={styles.eyebrow}>Curadoria / hardware</p><h1>Monte um setup que dá vontade de usar.</h1><p className={styles.lead}>Comece pelas ofertas em destaque, veja o que combina com sua rotina e confira os detalhes direto na loja antes de decidir.</p></section><section className={`container ${styles.linksSection}`}><ProductList items={productsByPriority} /></section></div>; }
