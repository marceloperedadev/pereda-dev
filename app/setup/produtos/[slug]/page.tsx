import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AffiliateLink } from "@/components/setup/AffiliateLink";
import { Disclosure } from "@/components/setup/Disclosure";
import { ProductViewTracker } from "@/components/setup/ProductViewTracker";
import { ProductStoreLink } from "@/components/setup/ProductStoreLink";
import { getProduct, isSafeExternalUrl, products, productPath } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "../../page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return buildMetadata({
    title: `${product.name} — contexto e especificações`,
    description: product.summary,
    path: productPath(slug),
    index: product.status === "verified",
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const verified = product.status === "verified";
  const affiliateOffers = product.offers.filter((offer) => isSafeExternalUrl(offer.affiliateUrl));
  const productOffers = product.offers.filter((offer) => isSafeExternalUrl(offer.productUrl));
  const sources = (product.sources ?? []).filter((source) => isSafeExternalUrl(source.url));

  return (
    <div className={styles.page}>
      <ProductViewTracker productId={product.id} productName={product.name} category={product.category} />
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>{product.category} / {product.brand}</p>
        <h1>{product.name}</h1>
        <p className={styles.lead}>{product.summary}</p>
      </section>
      <section className={`container ${styles.linksSection}`}>
        {!verified ? (
          <p className={styles.sectionLead} role="status">
            {sources.length
              ? "Dados técnicos baseados nas fontes citadas; este produto não foi testado pela equipe. Preço e estoque não foram verificados. Confirme a variante no anúncio."
              : "Ficha ilustrativa: modelo, especificações, fontes, preço e disponibilidade ainda não foram verificados. Não use esta página como recomendação de compra."}
            <Link href="/setup/metodologia"> Como avaliamos informações</Link>
          </p>
        ) : null}
        <div className={styles.pathGrid}>
          <article><span>Para quem</span><h2>{product.forWho}</h2></article>
          <article><span>Para quem não é</span><h2>{product.notFor}</h2></article>
          <article><span>Perfil</span><h2>{product.profile}</h2></article>
        </div>
        <h2>Especificações</h2>
        <dl>{product.specs.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>
        {sources.length ? <section><h2>Fontes técnicas</h2><ul>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} (consultado em {source.accessedAt}) ↗</a></li>)}</ul></section> : null}
        {affiliateOffers.map((offer) => (
          <AffiliateLink
            key={offer.store}
            className={styles.offerLink}
            href={offer.affiliateUrl!}
            productId={product.id}
            productName={product.name}
            category={product.category}
            store={offer.store}
            position="product-detail-offer"
          >
            {offer.price ? <>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: offer.currency ?? "BRL" }).format(offer.price)} · {offer.store}<small>Preço consultado em {offer.updatedAt}</small></> : `Ver produto · ${offer.store}`} ↗
          </AffiliateLink>
        ))}
        {productOffers.map((offer) => <ProductStoreLink key={offer.store} className={styles.offerLink} href={offer.productUrl!} productId={product.id} productName={product.name} category={product.category} store={offer.store} position="product-detail-reference">Ver produto · {offer.store} ↗</ProductStoreLink>)}
        {!affiliateOffers.length && !productOffers.length ? <p className={styles.sectionLead}>Nenhuma oferta específica foi verificada ou cadastrada para este item.</p> : null}
      </section>
      <section className={`container ${styles.linksSection}`}>
        <h2>Continue pesquisando</h2>
        <div className={styles.linkColumns}>
          <Link href="/setup/produtos">Todos os produtos</Link>
          <Link href="/setup/metodologia">Metodologia</Link>
          <Link href="/setup">Voltar ao laboratório</Link>
        </div>
        <Disclosure />
      </section>
    </div>
  );
}
