/**
 * Dados estruturados (JSON-LD) do portfÃ³lio.
 *
 * Este arquivo centraliza os schemas utilizados pelo site.
 *
 * Regra principal:
 * o JSON-LD deve representar informaÃ§Ãµes que tambÃ©m possam
 * ser encontradas e compreendidas pelo usuÃ¡rio na pÃ¡gina.
 */

import {
  absoluteUrl,
  siteConfig,
  socialLinks,
} from "@/lib/config/site";

import type { Project } from "@/lib/data/projects";

import { projectPath } from "@/lib/data/projects";

const personId = () =>
  `${siteConfig.url}/#person`;

const websiteId = () =>
  `${siteConfig.url}/#website`;

const homeId = () =>
  `${siteConfig.url}/#home`;

export function personSchema() {
  return {
    "@type": "Person",

    "@id": personId(),

    name: siteConfig.name,

    jobTitle: siteConfig.role,

    description:
      "Profissional de e-commerce e experiências digitais em Taubaté, SP. Constrói presenças digitais para negócios, marcas, profissionais e empreendedores.",

    url: siteConfig.url,

    email: `mailto:${siteConfig.email}`,

    telephone: siteConfig.telephone,

    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
    },

    knowsAbout: [
      "Presença digital",
      "Experiências digitais",
      "E-commerce",
      "Desenvolvimento web",
      "Sistemas web",
      "Next.js",
      "React",
      "TypeScript",
    ],

    sameAs: socialLinks().map(
      (social) => social.href,
    ),

    ...(siteConfig.photo
      ? {
          image: absoluteUrl(
            siteConfig.photo,
          ),
        }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",

    "@id": websiteId(),

    url: siteConfig.url,

    name: `${siteConfig.name} â€” ${siteConfig.role}`,

    inLanguage: siteConfig.lang,

    publisher: {
      "@id": personId(),
    },
  };
}

export function homeGraph() {
  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "WebPage",

        "@id": homeId(),

        url: siteConfig.url,

        name: `${siteConfig.name} | ${siteConfig.role} em ${siteConfig.city}, ${siteConfig.region}`,

        description:
          "Marcelo Felipe trabalha com presença digital, e-commerce e experiências digitais para negócios, marcas e profissionais.",

        inLanguage: siteConfig.lang,

        isPartOf: {
          "@id": websiteId(),
        },

        about: {
          "@id": personId(),
        },

        mainEntity: {
          "@id": personId(),
        },
      },

      websiteSchema(),

      personSchema(),
    ],
  };
}

export function aboutGraph() {
  const url = absoluteUrl("/sobre");

  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "ProfilePage",

        "@id": `${url}#page`,

        url,

        name: `Sobre ${siteConfig.name}`,

        inLanguage: siteConfig.lang,

        isPartOf: {
          "@id": websiteId(),
        },

        mainEntity: {
          "@id": personId(),
        },
      },

      personSchema(),

      websiteSchema(),
    ],
  };
}

export function breadcrumbSchema(
  items: {
    name: string;
    path: string;
  }[],
) {
  return {
    "@type": "BreadcrumbList",

    itemListElement: items.map(
      (item, index) => ({
        "@type": "ListItem",

        position: index + 1,

        name: item.name,

        item: absoluteUrl(
          item.path,
        ),
      }),
    ),
  };
}

export function projectGraph(
  project: Project,
) {
  const url = absoluteUrl(
    projectPath(project.slug),
  );

  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "CreativeWork",

        "@id": `${url}#project`,

        name: project.name,

        headline: project.h1,

        description:
          project.description,

        url,

        inLanguage: siteConfig.lang,

        genre: project.type,

        keywords:
          project.tags.join(", "),

        dateModified:
          project.updatedAt,

        author: {
          "@id": personId(),
        },

        creator: {
          "@id": personId(),
        },

        ...(project.cover.src
          ? {
              image: absoluteUrl(
                project.cover.src,
              ),
            }
          : {}),

        mainEntityOfPage: {
          "@id": `${url}#page`,
        },
      },

      {
        "@type": "WebPage",

        "@id": `${url}#page`,

        url,

        name: project.h1,

        description:
          project.description,

        inLanguage: siteConfig.lang,

        isPartOf: {
          "@id": websiteId(),
        },

        about: {
          "@id": `${url}#project`,
        },

        mainEntity: {
          "@id": `${url}#project`,
        },

        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
      },

      {
        ...breadcrumbSchema([
          {
            name: "InÃ­cio",
            path: "/",
          },
          {
            name: "Projetos",
            path: "/projetos",
          },
          {
            name: project.name,
            path: projectPath(
              project.slug,
            ),
          },
        ]),

        "@id": `${url}#breadcrumb`,
      },

      personSchema(),

      websiteSchema(),
    ],
  };
}
