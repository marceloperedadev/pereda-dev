import type { Metadata } from "next";
import Link from "next/link";

import { Disclosure } from "@/components/setup/Disclosure";
import { SetupExplorer } from "@/components/setup/SetupExplorer";
import { SetupGuide } from "@/components/setup/SetupGuide";
import { gamePath, games, guidePath, guides, setupPath, setups } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Setup, tecnologia e escolhas inteligentes",
  description: "Orientação prática para resolver dúvidas de tecnologia, planejar seu setup e escolher peças com contexto.",
  path: "/setup",
});

export default function SetupPage() {
  return (
    <div className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>Pereda Dev / Lab</p>
        <h1>Setup, tecnologia e escolhas inteligentes.</h1>
        <p className={styles.lead}>Orientação prática para entender o que você precisa antes de decidir o que comprar.</p>
        <div className={styles.heroActions}>
          <Link href="#monte">Monte seu setup</Link>
          <Link href="#explorar">Pesquisar uma necessidade</Link>
          <Link href="/setup/metodologia">Metodologia</Link>
        </div>
      </section>

      <section className={`container ${styles.paths}`} aria-labelledby="paths-title">
        <p className={styles.sectionLabel}>01 / Comece pelo que precisa resolver</p>
        <div className={styles.pathGrid}>
          <article>
            <span>Diagnóstico antes do upgrade</span>
            <h2 id="paths-title">Meu PC está lento?</h2>
            <p>Observe o que está limitando o computador e veja ajustes sem custo antes de trocar uma peça.</p>
            <Link href={guidePath("pc-lento-o-que-verificar")}>Entender o que verificar ↗</Link>
          </article>
          <article>
            <span>Trabalho e desenvolvimento</span>
            <h2>Quero montar um setup para programar</h2>
            <p>Comece por tela, ergonomia e periféricos de acordo com sua rotina, sem tratar uma lista como receita pronta.</p>
            <Link href={setupPath("setup-dev-hibrido")}>Ver ponto de partida ↗</Link>
          </article>
          <article>
            <span>Escolher uma tela</span>
            <h2>Preciso de um monitor melhor</h2>
            <p>Resolução, frequência e espaço de mesa mudam o que faz sentido para cada pessoa.</p>
            <Link href={guidePath("monitor-para-gaming")}>Entender as diferenças ↗</Link>
          </article>
        </div>
      </section>

      <section className={`container ${styles.guideSection}`} id="monte" aria-labelledby="guide-title">
        <p className={styles.sectionLabel}>02 / Orientação personalizada</p>
        <h2 id="guide-title">Monte seu setup</h2>
        <p className={styles.sectionLead}>Responda seis perguntas úteis para chegar a referências compatíveis com o uso informado. O guia não presume orçamento nem recomenda o que o catálogo ainda não cobre.</p>
        <SetupGuide />
      </section>

      <section id="explorar" className={`container ${styles.explorerSection}`} aria-labelledby="explorer-title">
        <p className={styles.sectionLabel}>03 / Pesquisa orientada</p>
        <h2 id="explorer-title">Encontre um caminho para sua necessidade</h2>
        <SetupExplorer />
      </section>

      <section className={`container ${styles.linksSection}`}>
        <div>
          <p className={styles.sectionLabel}>04 / Continue explorando</p>
          <h2>Conteúdo relacionado</h2>
        </div>
        <div className={styles.linkColumns}>
          <div><h3>Guias</h3>{guides.map((guide) => <Link key={guide.slug} href={guidePath(guide.slug)}>{guide.title} ↗</Link>)}</div>
          <div><h3>Jogos</h3>{games.map((game) => <Link key={game.slug} href={gamePath(game.slug)}>{game.name} ↗</Link>)}</div>
          <div><h3>Setups</h3>{setups.map((setup) => <Link key={setup.slug} href={setupPath(setup.slug)}>{setup.name} ↗</Link>)}</div>
          <div><h3>Curadoria</h3><Link href="/setup/curadoria">Recomendações revisadas ↗</Link></div>
        </div>
        <Disclosure />
      </section>
    </div>
  );
}
