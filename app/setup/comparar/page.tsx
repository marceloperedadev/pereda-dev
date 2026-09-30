import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AffiliateLink } from "@/components/setup/AffiliateLink";
import { Disclosure } from "@/components/setup/Disclosure";
import { getProduct, isMercadoLivreUrl } from "@/lib/data/setup";
import { getSetupProductListings } from "@/lib/server/setup-product-listings";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Comparativo de monitores Full HD",
  description: "Compare dois anúncios de monitores 24 polegadas Full HD: um modelo anunciado com 100 Hz e o LG UltraGear 144 Hz.",
  path: "/setup/comparar",
  index: false,
});

const comparedProducts = [
  { slug: "monitor-gamer-24-full-hd-100hz", label: "100 Hz / anúncio sem marca identificada" },
  { slug: "monitor-lg-ultragear-24g411a-144hz", label: "144 Hz / LG UltraGear" },
] as const;

const specs = [
  { label: "Tamanho", values: ["24 polegadas (anunciado)", "24 polegadas (anunciado)"] },
  { label: "Resolução", values: ["Full HD (anunciado)", "Full HD (anunciado)"] },
  { label: "Painel", values: ["IPS (anunciado)", "Não informado nesta ficha"] },
  { label: "Frequência", values: ["100 Hz (anunciado)", "144 Hz (anunciado)"] },
  { label: "Resposta", values: ["3 ms (anunciado)", "1 ms MBR (anunciado)"] },
  { label: "Recursos", values: ["HDR e HDMI (anunciados)", "G-SYNC, FreeSync e HDR10 (anunciados)"] },
] as const;

export default async function ComparePage() {
  const comparedData = comparedProducts.map((entry) => ({ ...entry, product: getProduct(entry.slug)! }));
  const listings = await getSetupProductListings(comparedData.map(({ product }) => product));
  const entries = comparedData.map(({ label, slug, product }) => ({
    label,
    slug,
    product,
    listing: listings[product.id] ?? null,
  }));

  return (
    <main className={styles.page}>
      <header className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>Setup / Comparação 01</p>
        <h1>100 Hz ou 144 Hz?</h1>
        <p className={styles.lead}>
          Dois anúncios de monitores 24 polegadas Full HD, lado a lado. Veja o que está informado,
          o que falta confirmar e para qual perfil cada opção pode fazer sentido.
        </p>
      </header>

      <section className={`container ${styles.comparison}`} aria-label="Comparação de monitores">
        <div className={styles.products}>
          {entries.map(({ label, product, listing }) => {
            const offer = product.offers.find((item) => item.store === "Mercado Livre" && isMercadoLivreUrl(item.affiliateUrl));
            const image = listing?.imageUrl
              ? { src: listing.imageUrl, alt: `Foto do anúncio: ${listing.title}` }
              : product.image;
            return (
              <article className={styles.product} key={product.id}>
                <div className={styles.imageFrame}>
                  {image ? (
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 90vw, 42vw" unoptimized />
                  ) : (
                    <div className={styles.imageUnavailable} role="status">
                      <span>Foto do anúncio indisponível</span>
                      <small>A comparação continua usando os dados cadastrados.</small>
                    </div>
                  )}
                  {image ? <span className={styles.photoLabel}>{listing?.imageUrl ? "Foto do anúncio · Mercado Livre" : "Foto de referência do modelo"}</span> : null}
                </div>
                <div className={styles.productCopy}>
                  <p className={styles.productEyebrow}>{label}</p>
                  <h2>{product.name}</h2>
                  <p>{product.summary}</p>
                  <p className={styles.fit}><strong>Faz sentido para:</strong> {product.forWho}</p>
                  {listing?.title ? <p className={styles.listingTitle}>Título recebido do anúncio: {listing.title}</p> : null}
                  {offer?.affiliateUrl ? (
                    <AffiliateLink
                      className={styles.cta}
                      href={offer.affiliateUrl}
                      productId={product.id}
                      productName={product.name}
                      category={product.category}
                      store="Mercado Livre"
                      position="monitor-comparison"
                    >
                      Conferir anúncio no Mercado Livre ↗
                    </AffiliateLink>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.specTableWrap}>
          <h2>O que os anúncios informam</h2>
          <div className={styles.specTable} role="table" aria-label="Especificações anunciadas dos monitores">
            <div className={styles.specHeader} role="row">
              <span role="columnheader">Característica</span>
              {entries.map(({ product }) => <span role="columnheader" key={product.id}>{product.brand === "LG" ? "LG UltraGear" : "Anúncio 100 Hz"}</span>)}
            </div>
            {specs.map((spec) => (
              <div className={styles.specRow} role="row" key={spec.label}>
                <strong role="rowheader">{spec.label}</strong>
                {spec.values.map((value, index) => <span role="cell" key={`${spec.label}-${entries[index].product.id}`}>{value}</span>)}
              </div>
            ))}
          </div>
          <p className={styles.note}>
            Os dados acima são os informados nos anúncios e não foram testados. “1 ms MBR” e “3 ms” podem usar métodos de medição diferentes;
            não devem ser tratados como equivalentes. O primeiro anúncio não identifica claramente marca e modelo, então confirme esses dados antes de comprar.
          </p>
        </div>
      </section>

      <section className={`container ${styles.footer}`}>
        <p>O Pereda Dev não vende os produtos. A compra e o atendimento acontecem no Mercado Livre, com o vendedor do anúncio.</p>
        <div className={styles.links}>
          <Link href="/setup/produtos">Ver os produtos cadastrados ↗</Link>
          <Link href="/setup/metodologia">Como fazemos as comparações ↗</Link>
        </div>
        <Disclosure />
      </section>
    </main>
  );
}
