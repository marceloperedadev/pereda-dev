import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Disclosure } from "@/components/setup/Disclosure";
import { SetupContentViewTracker } from "@/components/setup/SetupContentViewTracker";
import { JsonLd } from "@/components/ui/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/config/site";
import { getGuide, guidePath, guides, hasMercadoLivreOffer, productById, productPath } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "../../page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return buildMetadata({ title: guide.title, description: guide.description, path: guidePath(slug), type: "article", index: guide.index === true });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const related = guide.productIds.map(productById).filter((item) => item !== undefined && hasMercadoLivreOffer(item));
  const articleGraph = guide.index ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updatedAt,
    inLanguage: siteConfig.lang,
    mainEntityOfPage: absoluteUrl(guidePath(guide.slug)),
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.name },
  } : undefined;

  return (
    <div className={styles.page}>
      {articleGraph ? <JsonLd data={articleGraph} /> : null}
      <SetupContentViewTracker contentType="guide" contentId={guide.slug} title={guide.title} />
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>{guide.eyebrow} / conteúdo editorial</p>
        <h1>{guide.title}</h1>
        <p className={styles.lead}>{guide.description}</p>
      </section>
      <article className={`container ${styles.linksSection}`}>
        {guide.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.content}</p></section>)}
        {guide.sources?.length ? (
          <section aria-labelledby="guide-sources">
            <h2 id="guide-sources">Fontes consultadas</h2>
            <ul>{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} (consultado em {source.accessedAt}) ↗</a></li>)}</ul>
          </section>
        ) : <p className={styles.sectionLead}>Este guia é introdutório e ainda não possui fontes técnicas citadas. <Link href="/setup/metodologia">Veja os critérios editoriais.</Link></p>}
        {related.length ? <>
          <h2>Referências de produto para pesquisar</h2>
          {related.map((product) => (
            <article key={product.id}>
              <p>{product.category} / referência ilustrativa</p>
              <h3><Link href={`${productPath(product.slug)}?source=guide:${guide.slug}`}>{product.name}</Link></h3>
              <p>{product.forWho}</p>
            </article>
          ))}
          <Disclosure />
        </> : null}
      </article>
    </div>
  );
}
