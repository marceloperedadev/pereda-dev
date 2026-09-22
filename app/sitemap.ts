import type { MetadataRoute } from "next";

import {
  absoluteUrl,
  siteConfig,
} from "@/lib/config/site";

import {
  projectPath,
  projects,
} from "@/lib/data/projects";

/**
 * Sitemap das páginas públicas e relevantes para indexação.
 *
 * Páginas que não devem aparecer nos resultados de busca,
 * como /privacidade, não são incluídas aqui.
 */
export default function sitemap(): MetadataRoute.Sitemap {
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

  return [
    ...staticPages,
    ...projectPages,
  ];
}