import type { MetadataRoute } from "next";

import {
  absoluteUrl,
  siteConfig,
} from "@/lib/config/site";

import {
  projectPath,
  projects,
} from "@/lib/data/projects";
import { guidePath, guides, productPath, products } from "@/lib/data/setup";
import { getPublishedCuration } from "@/lib/server/curation-store";

/**
 * Sitemap das páginas públicas e relevantes para indexação.
 *
 * Páginas que não devem aparecer nos resultados de busca,
 * como /privacidade, não são incluídas aqui.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteLastModified = new Date(
    siteConfig.updatedAt,
  );

  const staticPages: MetadataRoute.Sitemap =
    [
      {
        url: absoluteUrl("/"),
        lastModified: siteLastModified,
        changeFrequency: "monthly",
        priority: 1,
      },

      {
        url: absoluteUrl("/projetos"),
        lastModified: siteLastModified,
        changeFrequency: "monthly",
        priority: 0.9,
      },

      {
        url: absoluteUrl("/sobre"),
        lastModified: siteLastModified,
        changeFrequency: "yearly",
        priority: 0.7,
      },

      {
        url: absoluteUrl("/contato"),
        lastModified: siteLastModified,
        changeFrequency: "yearly",
        priority: 0.7,
      },
    ];

  const projectPages: MetadataRoute.Sitemap =
    projects.map((project) => ({
      url: absoluteUrl(
        projectPath(project.slug),
      ),

      lastModified: new Date(
        project.updatedAt,
      ),

      changeFrequency: "monthly",

      priority: 0.8,
    }));

  const setupPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/setup"),
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...["/setup/produtos", "/setup/guias", "/setup/jogos", "/setup/setups", "/setup/metodologia", "/setup/transparencia"].map((path) => ({
      url: absoluteUrl(path),
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: path.includes("metodologia") ? 0.6 : 0.7,
    })),
    ...products.filter((product) => product.status === "verified").map((product) => ({
      url: absoluteUrl(productPath(product.slug)),
      lastModified: new Date(product.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...guides.filter((guide) => guide.index === true).map((guide) => ({
      url: absoluteUrl(guidePath(guide.slug)),
      lastModified: new Date(guide.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  let curatedPages: MetadataRoute.Sitemap = [];
  try {
    curatedPages = (await getPublishedCuration())
      .filter((product) => product.slug)
      .map((product) => ({
        url: absoluteUrl(`/setup/curadoria/${product.slug}`),
        lastModified: new Date(product.updated_at),
        changeFrequency: "daily" as const,
        priority: 0.65,
      }));
  } catch {
    // Keep the site map useful when Supabase is not configured yet.
  }

  const publishedCurationPages: MetadataRoute.Sitemap = curatedPages.length > 0
    ? [{
        url: absoluteUrl("/setup/curadoria"),
        lastModified: siteLastModified,
        changeFrequency: "daily",
        priority: 0.7,
      }, ...curatedPages]
    : [];

  return [
    ...staticPages,
    ...projectPages,
    ...setupPages,
    ...publishedCurationPages,
  ];
}
