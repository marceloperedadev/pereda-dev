/**
 * Taxonomia compartilhada das frentes de trabalho da Pereda Dev.
 *
 * A mesma fonte alimenta a página comercial do Pereda Links e a
 * experiência de links, evitando que cada página descreva os serviços
 * de uma forma diferente.
 *
 * Provas: apenas projetos reais. A frente de links é demonstrada pelo
 * próprio Pereda Links, não por um case de cliente.
 */

export type SolutionKey = "sites" | "lojas" | "links";

export type Solution = Readonly<{
  key: SolutionKey;
  index: string;
  name: string;
  tagline: string;
  summary: string;
  points: readonly string[];
  evidence: string;
  projectHref: string;
  projectCta: string;
}>;

export const SOLUTIONS: readonly Solution[] = [
  {
    key: "sites",
    index: "01",
    name: "Sites institucionais",
    tagline: "Presença e credibilidade",
    summary:
      "Para empresas e profissionais que precisam apresentar a marca, os serviços e a atuação em um site próprio.",
    points: [
      "Arquitetura e conteúdo",
      "Páginas institucionais",
      "Contato e estrutura para SEO",
    ],
    evidence: "Ortoclínica Taubaté · site institucional",
    projectHref: "/projetos/ortoclinica-taubate",
    projectCta: "Ver projeto institucional",
  },
  {
    key: "lojas",
    index: "02",
    name: "Lojas virtuais",
    tagline: "Catálogo e compra online",
    summary:
      "Para negócios que precisam vender pela internet, com catálogo, produtos, carrinho e uma jornada de compra organizada.",
    points: [
      "Catálogo e produtos",
      "Carrinho e checkout",
      "Experiência de compra",
    ],
    evidence: "Mimo Pet · site e loja virtual",
    projectHref: "/projetos/mimo-pet",
    projectCta: "Ver loja virtual",
  },
  {
    key: "links",
    index: "03",
    name: "Experiências de links",
    tagline: "Apresentação e contato",
    summary:
      "Para marcas e profissionais que querem uma página própria de apresentação, com os principais canais em um só lugar.",
    points: [
      "Identidade visual autoral",
      "Até 6 links principais",
      "Publicação e uma rodada de ajustes",
    ],
    evidence: "Demonstração própria · Pereda Links",
    projectHref: "/pereda-links",
    projectCta: "Conhecer o Pereda Links",
  },
] as const;
