import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AffiliateLink } from "@/components/setup/AffiliateLink";
import { ProductStoreLink } from "@/components/setup/ProductStoreLink";
import { ProductViewTracker } from "@/components/setup/ProductViewTracker";
import { getPublishedCuration } from "@/lib/server/curation-store";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatCurationContext } from "@/lib/utils/curation";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function findProduct(slug: string) {
  try {
    return (await getPublishedCuration()).find((item) => item.slug === slug);
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) return buildMetadata({ title: "Recomendação não encontrada | Pereda Dev", description: "Esta recomendação não está publicada ou precisa de nova verificação.", path: `/setup/curadoria/${slug}`, index: false });
  return buildMetadata({ title: `${product.editorial_title} | Curadoria Pereda Dev`, description: product.recommendation_reason!, path: `/setup/curadoria/${slug}`, type: "article" });
}

export default async function CuratedProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) notFound();

  const link = product.affiliate_url ?? product.source_url!;
  const updated = product.last_checked_at
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(product.last_checked_at))
    : "indisponível";
  const price = product.price === null ? undefined : new Intl.NumberFormat("pt-BR", { style: "currency", currency: product.currency ?? "BRL" }).format(product.price);

  return (
    <main className={`container ${styles.page}`}>
      <ProductViewTracker productId={product.source_product_id} productName={product.editorial_title!} category={product.source_category_id ?? "Tecnologia"} />
      <nav className={styles.breadcrumb} aria-label="Navegação estrutural"><Link href="/">Início</Link><span>/</span><Link href="/setup">Setup</Link><span>/</span><Link href="/setup/curadoria">Curadoria</Link></nav>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{product.contexts.map(formatCurationContext).join(" · ")}</p>
        <h1>{product.editorial_title}</h1>
        <p className={styles.lead}>{product.recommendation_reason}</p>
      </header>
      {product.source_image_url ? <figure className={styles.imageFigure}><div className={styles.image}><Image src={product.source_image_url} alt={product.source_title ?? product.editorial_title!} fill sizes="(max-width: 700px) 92vw, 70vw" priority /></div><figcaption>Imagem e título fornecidos pelo anúncio do Mercado Livre: {product.source_title}</figcaption></figure> : null}
      <section className={styles.content}>
        <div>
          <h2>Para quem faz sentido</h2>
          <p>{product.suitable_for}</p>
          <h2>O que considerar</h2>
          <p>{product.limitations}</p>
        </div>
        <aside className={styles.priceBox}>
          <p className={styles.label}>Dados do anúncio · Mercado Livre</p>
          <p className={styles.sourceTitle}>{product.source_title}</p>
          <p className={styles.condition}>Condição informada: {product.source_condition === "new" ? "novo" : product.source_condition === "used" ? "usado" : product.source_condition ?? "não informada"}.</p>
          <p className={styles.label}>Preço consultado</p>
          <p className={styles.price}>{price}</p>
          <p className={styles.updated}>Consulta em {updated}</p>
          <p className={styles.updated}>Anúncio ativo nessa consulta; estoque não confirmado.</p>
          <a className={styles.sourceLink} href={product.source_url!} target="_blank" rel="nofollow noopener noreferrer">Abrir anúncio original ↗</a>
          {product.affiliate_url ? (
            <AffiliateLink href={link} productId={product.source_product_id} productName={product.editorial_title!} category={product.source_category_id ?? "Tecnologia"} store="Mercado Livre" position="curation-detail">Ver preço atual ↗</AffiliateLink>
          ) : (
            <ProductStoreLink href={link} productId={product.source_product_id} productName={product.editorial_title!} category={product.source_category_id ?? "Tecnologia"} store="Mercado Livre" position="curation-detail">Ver preço atual ↗</ProductStoreLink>
          )}
          {product.affiliate_url ? <small>Link afiliado; pode gerar comissão sem custo adicional.</small> : null}
        </aside>
      </section>
      <p className={styles.notice}>Preço, anúncio e disponibilidade podem mudar depois da consulta. Confirme variante, frete e condições na loja. A recomendação não substitui uma análise da compatibilidade com o seu equipamento.</p>
      <Link className={styles.back} href="/setup/curadoria">← Voltar à curadoria</Link>
    </main>
  );
}
