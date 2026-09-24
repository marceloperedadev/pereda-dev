import type { Metadata } from "next";
import Link from "next/link";

import { Disclosure } from "@/components/setup/Disclosure";
import { SetupExplorer } from "@/components/setup/SetupExplorer";
import { SetupGuide } from "@/components/setup/SetupGuide";
import { games, guidePath, guides, setupPath, setups } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = buildMetadata({ title: "Setup, tecnologia e escolhas inteligentes", description: "Guias, comparativos e recomendações para montar um PC e um setup que realmente façam sentido para você.", path: "/setup" });

export default function SetupPage() {
  return (
    <div className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>Pereda Dev / Lab</p>
        <h1>Setup, tecnologia e escolhas inteligentes.</h1>
        <p className={styles.lead}>Guias, comparativos e recomendações para montar um PC e um setup que realmente façam sentido para você.</p>
        <div className={styles.heroActions}><Link href="#monte">Monte seu setup</Link><Link href="#explorar">Explorar curadoria</Link><Link href="/setup/metodologia">Metodologia</Link></div>
      </section>

      <section className={`container ${styles.paths}`} aria-labelledby="paths-title">
        <p className={styles.sectionLabel}>01 / Por onde começar</p>
        <div className={styles.pathGrid}><article><span>PC & hardware</span><h2 id="paths-title">Escolha uma peça com contexto</h2><p>Compare especificações, perfil de uso e o motivo de cada indicação.</p><Link href="/setup/produtos">Explorar produtos ↗</Link><Link href="/setup/comparar">Comparativos em preparação ↗</Link></article><article><span>Guias e comparações</span><h2>Entenda antes de escolher</h2><p>Conteúdo objetivo para transformar intenção em uma decisão mais segura.</p><Link href="/setup/guias">Ler guias ↗</Link></article><article><span>Jogos e setups</span><h2>Comece pelo seu contexto</h2><p>Jogos, perfis e orçamentos como pontos de entrada para uma composição coerente.</p><Link href="/setup/setups">Ver setups ↗</Link></article></div>
      </section>

      <section id="monte" className={`container ${styles.guideSection}`} aria-labelledby="guide-title"><p className={styles.sectionLabel}>02 / Guia interativo</p><h2 id="guide-title">Monte seu setup</h2><p className={styles.sectionLead}>Nove perguntas para transformar uma intenção ampla em um ponto de partida mais consciente.</p><SetupGuide /></section>

      <section id="explorar" className={`container ${styles.explorerSection}`} aria-labelledby="explorer-title"><p className={styles.sectionLabel}>03 / Curadoria</p><h2 id="explorer-title">Explore produtos e tecnologias</h2><SetupExplorer /></section>

      <section className={`container ${styles.linksSection}`}><div><p className={styles.sectionLabel}>04 / Continue explorando</p><h2>Conteúdo relacionado</h2></div><div className={styles.linkColumns}><div><h3>Guias</h3>{guides.map((guide) => <Link key={guide.slug} href={guidePath(guide.slug)}>{guide.title} ↗</Link>)}</div><div><h3>Jogos</h3>{games.map((game) => <Link key={game.slug} href={`/setup/jogos/${game.slug}`}>{game.name} ↗</Link>)}</div><div><h3>Setups</h3>{setups.map((setup) => <Link key={setup.slug} href={setupPath(setup.slug)}>{setup.name} ↗</Link>)}</div></div><Disclosure /></section>
    </div>
  );
}
