"use client";

import { usePathname } from "next/navigation";

import { track } from "@/lib/analytics/events";

type Props = {
  href: string;
  productId: string;
  productName: string;
  category: string;
  store: string;
  position: string;
  className?: string;
  children: React.ReactNode;
};

export function AffiliateLink({ href, productId, productName, category, store, position, className, children }: Props) {
  const pathname = usePathname();
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={() => {
        const source = new URLSearchParams(window.location.search).get("source") ?? "direct";
        const [sourceType, sourceId] = source.split(":", 2);
        track("setup_affiliate_click", {
          product_id: productId,
          product_name: productName,
          category,
          store,
          page_path: pathname,
          source_type: sourceType,
          source_id: sourceId,
          position,
        });
      }}
    >
      {children}
    </a>
  );
}
