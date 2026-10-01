import type { Metadata } from "next";

import { CurationManager } from "@/components/setup/CurationManager";

export const metadata: Metadata = {
  title: "Produtos | Administração Pereda Dev",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminProductsPage() {
  return <div className="container"><CurationManager /></div>;
}