"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";

import styles from "./CurationManager.module.css";

type Listing = {
  sourceProductId: string;
  title: string;
  price: number | null;
  currency: string | null;
  sourceUrl: string | null;
  imageUrl: string | null;
  listingStatus: string;
};

type QueueProduct = {
  id: string;
  source_product_id: string;
  curation_status: "discovered" | "review" | "approved" | "published";
  slug: string | null;
  editorial_title: string | null;
  suitable_for: string | null;
  recommendation_reason: string | null;
  limitations: string | null;
  contexts: string[];
  source_title: string | null;
  source_url: string | null;
  source_image_url: string | null;
  price: number | null;
  currency: string | null;
  affiliate_url: string | null;
};

type ApiError = { error?: string };

function formatPrice(price: number | null, currency: string | null) {
  if (price === null || currency !== "BRL") return "Preço não informado";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

function encodeBasicAuth(username: string, password: string) {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `Basic ${btoa(binary)}`;
}

export function CurationManager() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [urlPreview, setUrlPreview] = useState<Listing | null>(null);
  const [affiliateUrls, setAffiliateUrls] = useState<Record<string, string>>({});
  const [editorial, setEditorial] = useState<Record<string, { slug: string; title: string; suitableFor: string; reason: string; limitations: string }>>({});
  const [queueStatus, setQueueStatus] = useState<"discovered" | "review" | "approved" | "published">("discovered");
  const [results, setResults] = useState<Listing[]>([]);
  const [queue, setQueue] = useState<QueueProduct[]>([]);
  const [contexts, setContexts] = useState(["gaming"]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const authorization = useMemo(() => encodeBasicAuth(username, password), [username, password]);

  async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...init,
      headers: { Authorization: authorization, "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
    });
    const responseBody = await response.text();
    let data: (T & ApiError) | null = null;
    try { data = JSON.parse(responseBody) as T & ApiError; } catch { /* Plain-text responses are valid for authentication errors. */ }
    if (!response.ok) {
      throw new Error(data?.error || responseBody.slice(0, 200).trim() || `A solicitação falhou (${response.status}).`);
    }
    if (!data) throw new Error("A resposta do servidor não pôde ser interpretada.");
    return data;
  }

  async function loadQueue(status: typeof queueStatus = queueStatus) {
    const data = await request<{ products: QueueProduct[] }>(`/api/admin/curadoria/produtos?status=${status}`);
    setQueue(data.products);
    setEditorial((current) => {
      const next = { ...current };
      for (const product of data.products) next[product.id] ??= {
        slug: product.slug ?? "",
        title: product.editorial_title ?? "",
        suitableFor: product.suitable_for ?? "",
        reason: product.recommendation_reason ?? "",
        limitations: product.limitations ?? "",
      };
      return next;
    });
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const params = new URLSearchParams({ q: query.trim() });
      const data = await request<{ results: Listing[] }>(`/api/admin/curadoria/mercadolivre/search?${params}`);
      setResults(data.results);
      await loadQueue();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível consultar o Mercado Livre.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUrlPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    setUrlPreview(null);
    try {
      const data = await request<{ listing: Listing }>("/api/admin/curadoria/mercadolivre/preview", {
        method: "POST", body: JSON.stringify({ url: productUrl.trim() }),
      });
      setUrlPreview(data.listing);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível consultar esse link.");
    } finally { setBusy(false); }
  }

  async function importListing(itemId: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await request("/api/admin/curadoria/mercadolivre/import", {
        method: "POST",
        body: JSON.stringify({ itemId, contexts }),
      });
      await loadQueue();
      setNotice("Produto importado para revisão. Confira o anúncio e gere o link de afiliado no portal.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível importar o anúncio.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAffiliateLink(product: QueueProduct) {
    const affiliateUrl = affiliateUrls[product.id]?.trim() ?? product.affiliate_url ?? "";
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const fields = editorial[product.id];
      await request("/api/admin/curadoria/produtos", {
        method: "PATCH",
        body: JSON.stringify({
          id: product.id,
          status: product.curation_status === "discovered" ? "review" : product.curation_status,
          ...(affiliateUrl ? { affiliateUrl } : {}),
          ...(fields ? Object.fromEntries(Object.entries({ slug: fields.slug, editorialTitle: fields.title, suitableFor: fields.suitableFor, recommendationReason: fields.reason, limitations: fields.limitations }).filter(([, value]) => value.trim().length >= 3)) : {}),
        }),
      });
      await loadQueue();
      setAffiliateUrls((current) => ({ ...current, [product.id]: "" }));
      setNotice(product.curation_status === "discovered" ? "Ficha salva e enviada para revisão. Ainda não foi publicada." : "Alterações editoriais salvas.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível salvar o link de afiliado.");
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(product: QueueProduct, status: QueueProduct["curation_status"]) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const fields = editorial[product.id];
      await request("/api/admin/curadoria/produtos", {
        method: "PATCH",
        body: JSON.stringify({ id: product.id, status, ...(fields ? Object.fromEntries(Object.entries({ slug: fields.slug, editorialTitle: fields.title, suitableFor: fields.suitableFor, recommendationReason: fields.reason, limitations: fields.limitations }).filter(([, value]) => value.trim().length >= 3)) : {}) }),
      });
      await loadQueue();
      setNotice(`Status atualizado para ${status}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível atualizar o status.");
    } finally {
      setBusy(false);
    }
  }

  function updateEditorial(productId: string, field: keyof NonNullable<typeof editorial[string]>, value: string) {
    setEditorial((current) => {
      const existing = current[productId];
      const updated = Object.assign({ slug: "", title: "", suitableFor: "", reason: "", limitations: "" }, existing);
      updated[field] = value;
      return { ...current, [productId]: updated };
    });
  }

  function toggleContext(value: string) {
    setContexts((current) => current.includes(value)
      ? current.filter((context) => context !== value)
      : [...current, value]);
  }

  return (
    <section className={styles.page} aria-labelledby="curation-admin-title">
      <p className={styles.eyebrow}>Área administrativa · não indexada</p>
      <h1 id="curation-admin-title">Adicionar produtos à curadoria</h1>
      <p className={styles.lead}>Cadastre produtos por link ou busca, revise os dados e adicione o link de afiliado.</p>

      <fieldset className={styles.credentials}>
        <legend>Acesso à curadoria</legend>
        <label>Usuário
          <input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>Senha
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <p>Use o usuário e a senha definidos para a curadoria. Eles ficam apenas na memória desta página.</p>
      </fieldset>

      <form className={styles.search} onSubmit={handleUrlPreview}>
        <label htmlFor="product-url">Importação automática por link</label>
        <div className={styles.searchRow}>
          <input id="product-url" type="url" value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="https://www.mercadolivre.com.br/...MLB..." required />
          <button type="submit" disabled={busy || !username || !password}>{busy ? "Buscando…" : "Buscar informações"}</button>
        </div>
        <p>Cole um anúncio do Mercado Livre Brasil para preencher título, preço e imagem. O link precisa conter um código MLB.</p>
      </form>
      {urlPreview ? <article className={styles.card}>
        {urlPreview.imageUrl ? <Image className={styles.image} src={urlPreview.imageUrl} alt="Imagem obtida do anúncio" width={150} height={130} unoptimized /> : <div className={styles.imageFallback}>Sem foto no anúncio</div>}
        <div className={styles.cardBody}><p className={styles.eyebrow}>Prévia · {urlPreview.sourceProductId} · {urlPreview.listingStatus}</p><h3>{urlPreview.title}</h3><p>{formatPrice(urlPreview.price, urlPreview.currency)}</p><p>Categoria, descrição completa, marca e preço promocional não são fornecidos por esta consulta. A imagem é hospedada pela loja e pode mudar ou desaparecer.</p>
          <button type="button" onClick={() => importListing(urlPreview.sourceProductId)} disabled={busy || urlPreview.listingStatus !== "active"}>Importar para rascunho de revisão</button>
        </div>
      </article> : null}

      <form className={styles.search} onSubmit={handleSearch}>
        <label htmlFor="product-search">Buscar no Mercado Livre</label>
        <div className={styles.searchRow}>
          <input id="product-search" value={query} onChange={(event) => setQuery(event.target.value)} minLength={2} maxLength={100} placeholder="Ex.: monitor gamer 144 Hz" required />
          <button type="submit" disabled={busy || !username || !password}>{busy ? "Aguarde…" : "Buscar produtos"}</button>
        </div>
        <p>Digite o nome para localizar anúncios e comparar preço e disponibilidade.</p>
        <fieldset className={styles.contexts}>
          <legend>Contextos do produto</legend>
          <small className={styles.fieldHint}>Marque os cenários em que este produto pode ser útil.</small>
          {[["gaming", "Gaming"], ["programacao", "Programação"], ["trabalho", "Trabalho"]].map(([value, label]) => (
            <label key={value}><input type="checkbox" checked={contexts.includes(value)} onChange={() => toggleContext(value)} /> {label}</label>
          ))}
        </fieldset>
      </form>

      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {notice ? <p className={styles.notice} role="status">{notice}</p> : null}

      {results.length ? <section className={styles.results} aria-labelledby="search-results-title">
        <h2 id="search-results-title">Resultados encontrados</h2>
        {results.map((item) => <article className={styles.card} key={item.sourceProductId}>
          {item.imageUrl ? <Image className={styles.image} src={item.imageUrl} alt="" width={150} height={130} unoptimized /> : <div className={styles.imageFallback}>Sem foto no anúncio</div>}
          <div className={styles.cardBody}>
            <p className={styles.eyebrow}>{item.sourceProductId} · {item.listingStatus === "active" ? "Anúncio ativo" : item.listingStatus}</p>
            <h3>{item.title}</h3>
            <p>{formatPrice(item.price, item.currency)}</p>
            {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer">Conferir anúncio no Mercado Livre ↗</a> : null}
            <button type="button" onClick={() => importListing(item.sourceProductId)} disabled={busy || item.listingStatus !== "active"}>Importar para revisão</button>
          </div>
        </article>)}
      </section> : null}

      <section className={styles.queue} aria-labelledby="review-queue-title">
        <div className={styles.queueHeading}>
          <div><p className={styles.eyebrow}>Revisão editorial</p><h2 id="review-queue-title">Fila de curadoria</h2></div>
          <label>Status da fila<select value={queueStatus} onChange={(event) => { const status = event.target.value as typeof queueStatus; setQueueStatus(status); setBusy(true); setError(""); void loadQueue(status).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Não foi possível carregar a fila.")).finally(() => setBusy(false)); }}><option value="discovered">Importados</option><option value="review">Em revisão</option><option value="approved">Aprovados</option><option value="published">Publicados</option></select></label>
          <button type="button" className={styles.secondaryButton} onClick={() => { setBusy(true); setError(""); void loadQueue().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Não foi possível carregar a fila.")).finally(() => setBusy(false)); }} disabled={busy || !username || !password}>Atualizar fila</button>
        </div>
        {queue.length ? queue.map((product) => <article className={styles.queueItem} key={product.id}>
          {product.source_image_url ? <Image className={styles.queueImage} src={product.source_image_url} alt="" width={92} height={100} unoptimized /> : null}
          <div className={styles.queueDetails}>
            <p className={styles.eyebrow}>{product.source_product_id} · {formatPrice(product.price, product.currency)}</p>
            <h3>{product.source_title ?? "Anúncio importado"}</h3>
          <p className={styles.eyebrow}>Status: {product.curation_status}</p>
          {product.source_url ? <a href={product.source_url} target="_blank" rel="noreferrer">Conferir anúncio ↗</a> : null}
          <label>Slug público<input value={editorial[product.id]?.slug ?? ""} onChange={(event) => updateEditorial(product.id, "slug", event.target.value)} placeholder="nome-do-produto" /><small className={styles.fieldHint}>Final da URL pública; use letras minúsculas e hífens.</small></label>
          <label>Título editorial<input value={editorial[product.id]?.title ?? ""} onChange={(event) => updateEditorial(product.id, "title", event.target.value)} /><small className={styles.fieldHint}>Nome curto mostrado na página do produto.</small></label>
          <label>Para quem é indicado<input value={editorial[product.id]?.suitableFor ?? ""} onChange={(event) => updateEditorial(product.id, "suitableFor", event.target.value)} /><small className={styles.fieldHint}>Perfil de uso ou pessoa que mais se beneficia.</small></label>
          <label>Motivo da curadoria<textarea value={editorial[product.id]?.reason ?? ""} onChange={(event) => updateEditorial(product.id, "reason", event.target.value)} rows={3} /><small className={styles.fieldHint}>Explique por que o produto merece recomendação.</small></label>
          <label>Limitações e pontos de atenção<textarea value={editorial[product.id]?.limitations ?? ""} onChange={(event) => updateEditorial(product.id, "limitations", event.target.value)} rows={3} /><small className={styles.fieldHint}>Registre incompatibilidades, limites ou ressalvas.</small></label>
          <label htmlFor={`affiliate-${product.id}`}>Link de afiliado do Mercado Livre
              <input id={`affiliate-${product.id}`} type="url" placeholder="https://meli.la/..." value={affiliateUrls[product.id] ?? product.affiliate_url ?? ""} onChange={(event) => setAffiliateUrls((current) => ({ ...current, [product.id]: event.target.value }))} />
              <small className={styles.fieldHint}>Link gerado no portal de afiliados; usado no botão de compra.</small>
            </label>
          <button type="button" onClick={() => saveAffiliateLink(product)} disabled={busy}>{product.curation_status === "discovered" ? "Salvar ficha e enviar para revisão" : "Salvar alterações editoriais"}</button>
          {product.curation_status === "review" ? <button type="button" onClick={() => changeStatus(product, "approved")} disabled={busy}>Aprovar editorialmente</button> : null}
          {product.curation_status === "approved" ? <button type="button" onClick={() => changeStatus(product, "published")} disabled={busy}>Publicar ficha</button> : null}
          {product.curation_status === "published" ? <button type="button" onClick={() => changeStatus(product, "approved")} disabled={busy}>Retirar da publicação</button> : null}
          </div>
        </article>) : <p className={styles.empty}>Nenhum produto aguardando link. Busque um anúncio acima para começar.</p>}
      </section>
    </section>
  );
}
