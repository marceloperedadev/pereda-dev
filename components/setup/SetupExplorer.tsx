"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { track } from "@/lib/analytics/events";
import { gamePath, games, guidePath, guides, products, setupPath, setups } from "@/lib/data/setup";

import styles from "./SetupExplorer.module.css";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
const categories = [...new Set(products.map((product) => product.category))];
const profiles = [...new Set(products.map((product) => product.profile))];
const useCases = [...new Set(products.flatMap((product) => product.useCases))];
const contentItems = [
  ...games.map((item) => ({ type: "Jogo", title: item.name, summary: item.description, href: gamePath(item.slug), search: [item.name, item.genre, item.description, ...item.targets.map((target) => target.detail)].join(" ") })),
  ...guides.map((item) => ({ type: "Guia", title: item.title, summary: item.description, href: guidePath(item.slug), search: [item.title, item.description, item.eyebrow, ...(item.searchTerms ?? []), ...item.sections.flatMap((section) => [section.title, section.content])].join(" ") })),
  ...setups.map((item) => ({ type: "Setup", title: item.name, summary: item.description, href: setupPath(item.slug), search: [item.name, item.profile, item.budget, item.description, ...(item.searchTerms ?? []), ...item.focus].join(" ") })),
];
const ignoredTerms = new Set(["a", "ao", "ate", "com", "como", "de", "deixar", "do", "e", "esta", "está", "eu", "meu", "minha", "mais", "para", "pc", "preciso", "quero", "que", "ta", "um", "uma"]);
const queryTerms = (query: string) => normalize(query).split(/\s+/).filter((term) => term.length > 1 && !ignoredTerms.has(term));
const isBudgetQuery = (query: string) => /\b(ate|orcamento|limite|abaixo)\b/.test(normalize(query));

export function SetupExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [profile, setProfile] = useState("Todos");
  const [useCase, setUseCase] = useState("Todos");

  const results = useMemo(() => {
    const terms = queryTerms(query.trim());
    return products.filter((product) => {
      const searchable = normalize([
        product.name, product.brand, product.category, product.profile,
        product.summary, product.forWho, product.notFor, ...product.tags,
        ...product.useCases, ...product.specs.flatMap((spec) => [spec.label, spec.value]),
      ].join(" "));
      const compactSearchable = searchable.replace(/\s/g, "");
      return (category === "Todos" || product.category === category)
        && (profile === "Todos" || product.profile === profile)
        && (useCase === "Todos" || product.useCases.includes(useCase))
        && terms.every((term) => searchable.includes(term) || compactSearchable.includes(term.replace(/\s/g, "")));
    });
  }, [category, profile, query, useCase]);

  const relatedContent = useMemo(() => {
    if (category !== "Todos" || profile !== "Todos" || useCase !== "Todos") return [];
    const terms = queryTerms(query.trim());
    return contentItems.filter((item) => {
      const searchable = normalize(item.search);
      return terms.length > 0 && terms.every((term) => searchable.includes(term));
    });
  }, [category, profile, query, useCase]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Do not send the raw search string to analytics; it can contain personal data.
    track("setup_search", { query_length: query.trim().length, results: results.length + relatedContent.length });
  }

  function changeFilter(type: string, value: string, update: (value: string) => void) {
    update(value);
    track("setup_filter", { type, value });
  }

  return (
    <div className={styles.explorer}>
      <form className={styles.search} onSubmit={submitSearch} role="search">
        <Search size={18} aria-hidden="true" />
        <label className="srOnly" htmlFor="setup-search">Pesquisar produtos por nome, especificação ou uso</label>
        <input
          id="setup-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="O que você quer resolver? Ex.: PC lento, setup para programar"
          type="search"
        />
        <button type="submit">Buscar</button>
      </form>

      <div className={styles.toolbar}>
        <div className={styles.filterLabel}><SlidersHorizontal size={15} aria-hidden="true" /> Refinar resultados</div>
        <div className={styles.filters}>
          <label>Categoria
            <select value={category} onChange={(event) => changeFilter("category", event.target.value, setCategory)}>
              <option>Todos</option>{categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Perfil
            <select value={profile} onChange={(event) => changeFilter("profile", event.target.value, setProfile)}>
              <option>Todos</option>{profiles.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Uso
            <select value={useCase} onChange={(event) => changeFilter("use_case", event.target.value, setUseCase)}>
              <option>Todos</option>{useCases.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.resultLine} aria-live="polite">{results.length + relatedContent.length} {(results.length + relatedContent.length) === 1 ? "resultado" : "resultados"}</div>
      <div className={styles.results}>
        {results.map((product, index) => (
          <article key={product.id} className={styles.result}>
            <div className={styles.resultIndex}>{String(index + 1).padStart(2, "0")}</div>
            <div>
              <p className={styles.category}>{product.category} / {product.profile}</p>
              <h3><Link href={`/setup/produtos/${product.slug}?source=search`}>{product.name}</Link></h3>
              <p>{product.summary}</p>
              <span className={styles.reason}>Referência ilustrativa: {product.forWho}</span>
            </div>
            <Link className={styles.resultCta} href={`/setup/produtos/${product.slug}?source=search`}>Ver contexto <span aria-hidden="true">↗</span></Link>
          </article>
        ))}
        {relatedContent.length ? <section className={styles.related} aria-label="Conteúdo relacionado"><h3>Conteúdo relacionado</h3>{relatedContent.map((item) => <article key={item.href}><span>{item.type}</span><div><h4><Link href={item.href}>{item.title}</Link></h4><p>{item.summary}</p></div><Link href={item.href}>Explorar ↗</Link></article>)}</section> : null}
        {results.length === 0 && relatedContent.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhum item ou conteúdo corresponde aos termos e filtros.</p>
            {isBudgetQuery(query) ? <p>Ainda não há preços verificados para responder a buscas por orçamento.</p> : null}
            <Link href="/setup/guias">Explore os guias de escolha ↗</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
