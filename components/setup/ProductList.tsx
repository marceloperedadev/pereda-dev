import Image from "next/image";
import Link from "next/link";

import { ProductStoreLink } from "@/components/setup/ProductStoreLink";
import { hasMercadoLivreOffer, isMercadoLivreUrl, productPath, type Product } from "@/lib/data/setup";

import styles from "./ProductList.module.css";

export function ProductList({ items, limit, source = "product-list" }: { items: readonly Product[]; limit?: number; source?: string }) {
  const linkedItems = items.filter(hasMercadoLivreOffer);
  const visible = limit ? linkedItems.slice(0, limit) : linkedItems;

  return (
    <div className={styles.list}>
      {visible.map((product, index) => {
        const offer = product.offers.find((item) => item.store === "Mercado Livre"
          && (isMercadoLivreUrl(item.affiliateUrl) || isMercadoLivreUrl(item.productUrl)));
        const outboundUrl = isMercadoLivreUrl(offer?.affiliateUrl) ? offer.affiliateUrl : offer?.productUrl;
        const detailHref = `${productPath(product.slug)}?source=${encodeURIComponent(source)}`;

        return (
          <article key={product.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {product.image ? (
              <Link className={styles.image} href={detailHref}>
                <Image src={product.image.src} alt={product.image.alt} width={220} height={180} unoptimized />
              </Link>
            ) : null}
            <div className={styles.content}>
              <p>{product.category} / {product.profile}</p>
              <h3><Link href={detailHref}>{product.name}</Link></h3>
              <p>{product.summary}</p>
              <small><strong>Faz sentido para:</strong> {product.forWho}</small>
              {offer && outboundUrl ? (
                <div className={styles.offerBlock}>
                  <ProductStoreLink
                    className={styles.offer}
                    href={outboundUrl}
                    productId={product.id}
                    productName={product.name}
                    category={product.category}
                    store={offer.store}
                    position="product-list-card"
                  >
                    Confira no {offer.store} ↗
                  </ProductStoreLink>
                  {isMercadoLivreUrl(offer.affiliateUrl) ? <small className={styles.affiliateNote}>Link de afiliado; pode gerar comissão sem custo adicional.</small> : null}
                </div>
              ) : null}
            </div>
            <Link className={styles.context} href={detailHref}>Ver detalhes ↗</Link>
          </article>
        );
      })}
    </div>
  );
}
