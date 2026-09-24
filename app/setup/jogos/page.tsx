import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";
import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({ title: "Setup para jogos", description: "Ponto de partida de hardware e periféricos para diferentes tipos de jogo.", path: "/setup/jogos" });
export default function GamesPage() { return <div className={styles.page}><section className={`container ${styles.hero}`}><p className={styles.eyebrow}>Jogos / configuração</p><h1>Comece pelo jogo.</h1><p className={styles.lead}>Cada jogo cria exigências diferentes. Use estas páginas como ponto de partida e confirme os requisitos oficiais.</p></section><section className={`container ${styles.linksSection}`}><div className={styles.linkColumns}>{games.map((game) => <div key={game.slug}><p>{game.genre}</p><h2><Link href={`/setup/jogos/${game.slug}`}>{game.name}</Link></h2><p>{game.description}</p></div>)}</div></section></div>; }
