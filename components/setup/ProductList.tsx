import Link from "next/link";
import type { Product } from "@/lib/data/setup";
import { productPath } from "@/lib/data/setup";
import styles from "./ProductList.module.css";

export function ProductList({ items, limit, source = "product-list" }: { items: readonly Product[]; limit?: number; source?: string }) {
  const visible = limit ? items.slice(0, limit) : items;
  return <div className={styles.list}>{visible.map((product, index) => <article key={product.id}><span>{String(index + 1).padStart(2, "0")}</span><div><p>{product.category} / {product.profile}</p><h3><Link href={`${productPath(product.slug)}?source=${encodeURIComponent(source)}`}>{product.name}</Link></h3><p>{product.summary}</p><small><strong>Para quem:</strong> {product.forWho}</small></div><Link href={`${productPath(product.slug)}?source=${encodeURIComponent(source)}`}>Ver contexto ↗</Link></article>)}</div>;
}
