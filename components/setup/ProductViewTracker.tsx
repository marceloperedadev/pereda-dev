"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { track } from "@/lib/analytics/events";

export function ProductViewTracker({ productId, productName, category }: { productId: string; productName: string; category: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get("source") ?? "direct";
    const [sourceType, sourceId] = source.split(":", 2);
    track("setup_product_view", { product_id: productId, product_name: productName, category, page_path: pathname, source_type: sourceType, source_id: sourceId });
  }, [category, pathname, productId, productName]);

  return null;
}
