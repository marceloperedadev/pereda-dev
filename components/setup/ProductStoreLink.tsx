"use client";

import { usePathname } from "next/navigation";

import { track } from "@/lib/analytics/events";

type Props = { href: string; productId: string; productName: string; category: string; store: string; position: string; className?: string; children: React.ReactNode };

export function ProductStoreLink({ href, productId, productName, category, store, position, className, children }: Props) {
  const pathname = usePathname();
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={() => track("setup_product_click", {
        product_id: productId,
        product_name: productName,
        category,
        store,
        page_path: pathname,
        position,
        source: new URLSearchParams(window.location.search).get("source") ?? "direct",
      })}
    >
      {children}
    </a>
  );
}
