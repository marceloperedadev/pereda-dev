import type { Metadata } from "next";
import Link from "next/link";
import { guides, guidePath } from "@/lib/data/setup";
import { buildMetadata } from "@/lib/seo/metadata";
import styles from "../page.module.css";

export const metadata: Metadata = buildMetadata({ title: "Guias para escolher PC e setup", description: "Guias práticos sobre hardware, monitores, periféricos e decisões de compra.", path: "/setup/guias" });
export default function GuidesPage() { return <div className={styles.page}><section className={`container ${styles.hero}`}><p className={styles.eyebrow}>Conteúdo / decisões</p><h1>Entenda antes de escolher.</h1><p className={styles.lead}>Guias objetivos para transformar especificações em escolhas mais conscientes.</p></section><section className={`container ${styles.linksSection}`}><div className={styles.linkColumns}>{guides.map((guide) => <div key={guide.slug}><p>{guide.eyebrow}</p><h2><Link href={guidePath(guide.slug)}>{guide.title}</Link></h2><p>{guide.description}</p></div>)}</div></section></div>; }
