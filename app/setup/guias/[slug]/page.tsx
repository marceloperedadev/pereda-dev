import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Disclosure } from "@/components/setup/Disclosure";
import { SetupContentViewTracker } from "@/components/setup/SetupContentViewTracker";
import { getGuide, guidePath, guides, productById, productPath } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "../../page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return buildMetadata({ title: guide.title, description: guide.description, path: guidePath(slug), type: "article", index: false });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const related = guide.productIds.map(productById).filter((item) => item !== undefined);

  return (
    <div className={styles.page}>
      <SetupContentViewTracker contentType="guide" contentId={guide.slug} title={guide.title} />
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>{guide.eyebrow} / conteúdo editorial</p>
        <h1>{guide.title}</h1>
        <p className={styles.lead}>{guide.description}</p>
      </section>
      <article className={`container ${styles.linksSection}`}>
        {guide.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.content}</p></section>)}
        <p className={styles.sectionLead}>Este guia é introdutório e ainda não possui fontes técnicas citadas. Confirme especificações e preços antes de decidir. <Link href="/setup/metodologia">Veja os critérios editoriais.</Link></p>
        <h2>Referências de produto para pesquisar</h2>
        {related.map((product) => (
          <article key={product.id}>
            <p>{product.category} / referência ilustrativa</p>
            <h3><Link href={`${productPath(product.slug)}?source=guide:${guide.slug}`}>{product.name}</Link></h3>
            <p>{product.forWho}</p>
          </article>
        ))}
        <Disclosure />
      </article>
    </div>
  );
}
