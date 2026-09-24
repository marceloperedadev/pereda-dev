import type { Metadata } from "next";
import Link from "next/link";
import { setups, setupPath } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";
import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({ title: "Setups completos por objetivo", description: "Composições completas pensadas para FPS, desenvolvimento e setups minimalistas.", path: "/setup/setups" });
export default function SetupsPage() { return <div className={styles.page}><section className={`container ${styles.hero}`}><p className={styles.eyebrow}>Composições / objetivos</p><h1>Setups com uma intenção.</h1><p className={styles.lead}>Pontos de partida completos, apresentados como sistemas e não como listas de produtos.</p></section><section className={`container ${styles.linksSection}`}><div className={styles.linkColumns}>{setups.map((setup) => <div key={setup.slug}><p>{setup.profile}</p><h2><Link href={setupPath(setup.slug)}>{setup.name}</Link></h2><p>{setup.description}</p></div>)}</div></section></div>; }
