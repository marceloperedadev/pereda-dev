import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.role}`,
    short_name: siteConfig.name,
    description:
      "Portfólio de Marcelo Felipe, desenvolvedor Full Stack em Taubaté, SP. Sites profissionais, e-commerce e sistemas web.",

    start_url: "/",
    display: "standalone",

    background_color: "#08070A",
    theme_color: "#08070A",

    lang: siteConfig.lang,

    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}