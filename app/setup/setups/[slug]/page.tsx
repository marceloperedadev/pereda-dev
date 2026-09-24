import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Disclosure } from "@/components/setup/Disclosure";
import { ProductList } from "@/components/setup/ProductList";
import { SetupContentViewTracker } from "@/components/setup/SetupContentViewTracker";
import { getSetup, productById, setupPath, setups } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "../../page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return setups.map((setup) => ({ slug: setup.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const setup = getSetup(slug);
  if (!setup) return {};
  return buildMetadata({ title: setup.name, description: setup.description, path: setupPath(slug), index: false });
}

export default async function SetupDetailPage({ params }: Props) {
  const { slug } = await params;
  const setup = getSetup(slug);
  if (!setup) notFound();
  const items = setup.productIds.map(productById).filter((item) => item !== undefined);

  return (
    <div className={styles.page}>
      <SetupContentViewTracker contentType="setup" contentId={setup.slug} title={setup.name} />
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>{setup.profile} / {setup.budget}</p>
        <h1>{setup.name}</h1>
        <p className={styles.lead}>{setup.description}</p>
      </section>
      <section className={`container ${styles.linksSection}`}>
        <p className={styles.sectionLead}>Composição de referência, sem total de preços, orçamento validado ou teste de compatibilidade. Os itens individuais são exemplos editoriais.</p>
        <ul>{setup.focus.map((item) => <li key={item}>{item}</li>)}</ul>
        <ProductList items={items} source={`setup:${setup.slug}`} />
        <Disclosure />
      </section>
    </div>
  );
}
