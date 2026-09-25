import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getPublishedCuration } from "@/lib/server/curation-store";
import { buildMetadata } from "@/lib/seo/metadata";
import { AffiliateLink } from "@/components/setup/AffiliateLink";
import { ProductStoreLink } from "@/components/setup/ProductStoreLink";
import { formatCurationContext } from "@/lib/utils/curation";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let hasPublishedRecommendations = false;
  try {
    hasPublishedRecommendations = (await getPublishedCuration()).length > 0;
  } catch {
    // A página continua acessível, mas não indexável antes da integração.
  }
  return buildMetadata({
    title: "Curadoria de tecnologia | Pereda Dev",
    description: "Recomendações de tecnologia com contexto de uso, critérios editoriais, pontos de atenção e preço consultado no Mercado Livre.",
    path: "/setup/curadoria",
    index: hasPublishedRecommendations,
  });
}

function priceLabel(value: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(value));
}

export default async function CuradoriaPage() {
  let products = [] as Awaited<ReturnType<typeof getPublishedCuration>>;
  try {
    products = await getPublishedCuration();
  } catch {
    // A migration ou as credenciais podem ainda não estar configuradas.
  }

  return (
    <main className={styles.page}>
      <header className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>Pereda Dev / Setup</p>
        <h1>Tecnologia escolhida com contexto.</h1>
        <p className={styles.lead}>Cada item publicado passa por revisão. Você encontra para quem faz sentido, por que entrou na seleção, quais limites considerar e quando o preço foi consultado.</p>
        <Link href="/setup">Voltar à orientação por necessidade ↗</Link>
      </header>

      <section className={`container ${styles.collection}`} aria-labelledby="curadoria-title">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Recomendações revisadas</p>
          <h2 id="curadoria-title">Uma seleção curta, mantida sob revisão.</h2>
        </div>

        {products.length ? (
          <ol className={styles.list}>
            {products.map((product) => {
              const currentPrice = product.price!;
              const currency = product.currency!;
              const outputUrl = product.affiliate_url ?? product.source_url!;
              const changed = product.setup_price_history?.[0]?.previous_price;
              const movement = changed !== null && changed !== undefined && changed > 0
                ? ((currentPrice - changed) / changed) * 100
                : null;
              return (
                <li key={product.id}>
                  <article className={styles.item}>
                    {product.source_image_url ? (
                      <figure className={styles.imageWrap}>
                        <div className={styles.image}>
                          <Image src={product.source_image_url} alt={product.source_title ?? product.editorial_title!} fill sizes="(max-width: 700px) 88vw, 32vw" />
                        </div>
                        <figcaption>Imagem do anúncio · Mercado Livre</figcaption>
                      </figure>
                    ) : <div className={styles.imageFallback} aria-hidden="true">{product.editorial_title}</div>}
                    <div className={styles.copy}>
                      <p className={styles.context}>{product.contexts.map(formatCurationContext).join(" · ")}</p>
                      <h3><Link href={`/setup/curadoria/${product.slug}`}>{product.editorial_title}</Link></h3>
                      <p className={styles.reason}>{product.recommendation_reason}</p>
                      <p className={styles.forWho}><strong>Faz sentido para:</strong> {product.suitable_for}</p>
                      <p className={styles.limit}><strong>Considere também:</strong> {product.limitations}</p>
                    </div>
                    <div className={styles.priceBlock}>
                      <p className={styles.sourceLabel}>Dados do anúncio · Mercado Livre</p>
                      <p className={styles.sourceTitle}>{product.source_title}</p>
                      <p className={styles.price}>{priceLabel(currentPrice, currency)}</p>
                      <p className={styles.checked}>Consultado em {product.last_checked_at ? formatDate(product.last_checked_at) : "data indisponível"}</p>
                      {movement !== null ? <p className={styles.change}>Variação desde a consulta anterior: {movement > 0 ? "+" : ""}{movement.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</p> : null}
                      <p className={styles.availability}>Anúncio ativo na consulta; quantidade em estoque não confirmada.</p>
                      <a className={styles.sourceLink} href={product.source_url!} target="_blank" rel="nofollow noopener noreferrer">Abrir anúncio original ↗</a>
                      {product.affiliate_url ? (
                        <AffiliateLink className={styles.cta} href={outputUrl} productId={product.source_product_id} productName={product.editorial_title!} category={product.source_category_id ?? "Tecnologia"} store="Mercado Livre" position="curation-list">Ver preço atual no Mercado Livre ↗</AffiliateLink>
                      ) : (
                        <ProductStoreLink className={styles.cta} href={outputUrl} productId={product.source_product_id} productName={product.editorial_title!} category={product.source_category_id ?? "Tecnologia"} store="Mercado Livre" position="curation-list">Ver preço atual no Mercado Livre ↗</ProductStoreLink>
                      )}
                      {product.affiliate_url ? <small className={styles.affiliate}>Link de afiliado; pode gerar comissão sem custo adicional.</small> : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className={styles.empty}>
            <h3>Nenhuma recomendação publicada agora.</h3>
            <p>Os anúncios encontrados passam primeiro por análise humana. Quando uma ficha cumprir os critérios de publicação, ela aparece aqui.</p>
            <Link href="/setup/metodologia">Como funciona a revisão ↗</Link>
          </div>
        )}
        <p className={styles.disclosure}>O preço e a situação do anúncio são uma consulta pontual e podem mudar. A indicação é editorial e não garante compatibilidade com toda configuração. <Link href="/setup/transparencia">Transparência sobre afiliados</Link> · <Link href="/setup/metodologia">Metodologia</Link></p>
      </section>
    </main>
  );
}
