import type { Metadata } from "next";

import {
  absoluteUrl,
  siteConfig,
} from "@/lib/config/site";

type BuildArgs = Readonly<{
  title: string;
  description: string;

  /**
   * Caminho canônico da página.
   *
   * Ex.: "/projetos/belo-cao"
   */
  path: string;

  /**
   * Define se a página deve ser indexada pelos mecanismos
   * de busca.
   */
  index?: boolean;

  /**
   * Tipo utilizado pelo Open Graph.
   */
  type?: "website" | "article";
}>;

/**
 * Gera metadata consistente para as páginas do portfólio.
 *
 * Centraliza:
 * - title
 * - description
 * - canonical
 * - robots
 * - Open Graph
 * - Twitter/X
 *
 * As imagens sociais são fornecidas pelos arquivos
 * opengraph-image e twitter-image dos segmentos
 * correspondentes do Next.js.
 */
export function buildMetadata({
  title,
  description,
  path,
  index = true,
  type = "website",
}: BuildArgs): Metadata {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const cleanTitle = title.trim();
  const cleanDescription =
    description.trim();

  const canonicalUrl =
    absoluteUrl(normalizedPath);

  const robots = index
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      };

  return {
    metadataBase: new URL(
      siteConfig.url,
    ),

    title: cleanTitle,

    description: cleanDescription,

    applicationName: siteConfig.name,

    authors: [
      {
        name: siteConfig.name,
        url: siteConfig.url,
      },
    ],

    creator: siteConfig.name,

    publisher: siteConfig.name,

    alternates: {
      canonical: canonicalUrl,
    },

    robots,

    openGraph: {
      type,

      url: canonicalUrl,

      title: cleanTitle,

      description: cleanDescription,

      siteName: siteConfig.name,

      locale: siteConfig.locale,
    },

    twitter: {
      card: "summary_large_image",

      title: cleanTitle,

      description: cleanDescription,
    },

    other: {
      "content-language":
        siteConfig.lang,
    },
  };
}