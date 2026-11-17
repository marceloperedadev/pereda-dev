import type { Metadata } from "next";

import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl, siteConfig } from "@/lib/config/site";

import { Experience } from "./Experience";

const title = "Marcelo Felipe — Pereda Dev | Desenvolvedor Full Stack";
const description =
  "Conheça Marcelo Felipe, desenvolvedor Full Stack da Pereda Dev. Veja projetos reais e encontre os canais oficiais de contato.";

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: "/links/pereda-dev",
});

const graph = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  url: absoluteUrl("/links/pereda-dev"),
  isPartOf: {
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
  },
  breadcrumb: breadcrumbSchema([
    { name: "Início", path: absoluteUrl("/") },
    { name: "Links", path: absoluteUrl("/links/pereda-dev") },
  ]),
};

export default function PeredaDevLinksPage() {
  return (
    <div>
      <JsonLd data={graph} />
      <Experience />
    </div>
  );
}
