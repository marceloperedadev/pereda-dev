import type { Metadata } from "next";

import { ProductList } from "@/components/setup/ProductList";
import { products } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({ title: "Curadoria de produtos para PC e setup", description: "Produtos apresentados com contexto, perfil de uso, pontos de atenção e motivo da indicação.", path: "/setup/produtos" });

export default function ProductsPage() { return <div className={styles.page}><section className={`container ${styles.hero}`}><p className={styles.eyebrow}>Curadoria / hardware</p><h1>Produtos escolhidos pelo contexto.</h1><p className={styles.lead}>Cada indicação começa por uma pergunta: para quem e para qual contexto este item faz sentido?</p></section><section className={`container ${styles.linksSection}`}><ProductList items={products} /></section></div>; }
