import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Disclosure } from "@/components/setup/Disclosure";
import { ProductList } from "@/components/setup/ProductList";
import { SetupContentViewTracker } from "@/components/setup/SetupContentViewTracker";
import { gamePath, games, getGame, productById } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "../../page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return games.map((game) => ({ slug: game.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  return buildMetadata({ title: `Setup para jogar ${game.name}`, description: game.description, path: gamePath(slug), index: false });
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const related = game.productIds.map(productById).filter((item) => item !== undefined);

  return (
    <div className={styles.page}>
      <SetupContentViewTracker contentType="game" contentId={game.slug} title={game.name} />
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>{game.genre}</p>
        <h1>Setup para {game.name}</h1>
        <p className={styles.lead}>{game.description}</p>
      </section>
      <section className={`container ${styles.linksSection}`}>
        <p className={styles.sectionLead}>Orientação editorial geral. Requisitos oficiais, metas de FPS, benchmarks e compatibilidade não foram verificados para esta página.</p>
        <div className={styles.pathGrid}>
          <article><span>Ponto de partida</span><h2>{game.minimum}</h2></article>
          <article><span>Alternativa de uso</span><h2>{game.recommended}</h2></article>
          <article><span>Contexto</span><h2>{game.targets.map((target) => target.detail).join(" · ")}</h2></article>
        </div>
        <h2>Hardware e periféricos de referência</h2>
        <ProductList items={related} source={`game:${game.slug}`} />
        <Disclosure />
      </section>
    </div>
  );
}
