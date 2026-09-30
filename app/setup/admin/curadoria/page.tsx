import type { Metadata } from "next";

import { CurationManager } from "@/components/setup/CurationManager";

export const metadata: Metadata = {
  title: "Gestão de curadoria | Pereda Dev",
  robots: { index: false, follow: false, noarchive: true },
};

export default function CurationAdminPage() {
  return <main className="container"><CurationManager /></main>;
}
