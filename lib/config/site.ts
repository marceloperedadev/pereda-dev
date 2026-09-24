/**
 * Configuração central do site.
 *
 * Dados de identidade, contato, localização e perfis externos
 * devem permanecer centralizados aqui.
 *
 * Nenhum componente deve precisar escrever manualmente:
 * - e-mail;
 * - telefone;
 * - WhatsApp;
 * - domínio;
 * - perfis sociais;
 * - caminhos principais de imagens.
 */

const DEFAULT_SITE_URL = "https://www.peredadev.com.br";

const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  DEFAULT_SITE_URL;

/**
 * Normaliza a URL principal:
 * - remove barras finais;
 * - evita valores vazios.
 */
function normalizeSiteUrl(value: string): string {
  const normalized = value.replace(/\/+$/, "");

  return normalized || DEFAULT_SITE_URL;
}

export const siteConfig = {
  name: "Marcelo Felipe",

  domain: "www.peredadev.com.br",

  url: normalizeSiteUrl(rawUrl),

  role: "Desenvolvedor Web Full-Stack",

  specialty: "Desenvolvimento de Sites e E-commerce",

  commercial: {
    availability: "Projetos autorais e comerciais",

    offerings: [
      {
        name: "Landing pages",
        description:
          "Uma página focada em apresentar, captar contatos, divulgar uma oferta ou conduzir a uma ação.",
        price: "A partir de R$ 900",
      },

      {
        name: "Presença digital",
        description:
          "Identidade, estrutura e performance para apresentar e posicionar um negócio no digital.",
        price: "A partir de R$ 1.500",
      },

      {
        name: "Projetos sob medida",
        description:
          "Soluções de design, experiência e tecnologia construídas a partir das necessidades específicas do projeto.",
        price: "A partir de R$ 2.000+",
      },
    ],
  },

  lang: "pt-BR",

  locale: "pt_BR",

  email: "peredadev@gmail.com",

  whatsappNumber: "5512997093459",

  whatsappDisplay: "(12) 99709-3459",

  telephone: "+55 12 99709-3459",

  city: "Taubaté",

  region: "SP",

  country: "BR",

  /**
   * Perfis externos.
   *
   * Só serão exibidos quando as respectivas variáveis
   * de ambiente estiverem preenchidas.
   */
  social: {
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() || "",

    github:
      process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || "",
  },

  /**
   * Foto utilizada na seção "Sobre".
   *
   * A imagem fica dentro de /public.
   *
   * Arquivo:
   * public/projects/marcelo-felipe.webp
   *
   * Referência pública:
   * /projects/marcelo-felipe.webp
   *
   * O projeto utiliza WebP para essa imagem.
   */
  photo: "/projects/marcelo-felipe.webp",

  photoAlt:
    "Marcelo Felipe, desenvolvedor web e especialista em e-commerce em Taubaté, SP",

  /**
   * Data da última revisão do conteúdo.
   */
  updatedAt: "2026-09-21",

  /**
   * Token do Google Search Console.
   */
  googleVerification:
    process.env.GOOGLE_SITE_VERIFICATION?.trim() || "",
} as const;

/**
 * Gera uma URL absoluta a partir da URL principal do site.
 *
 * Exemplos:
 *
 * absoluteUrl()
 * → https://www.peredadev.com.br/
 *
 * absoluteUrl("/projetos")
 * → https://www.peredadev.com.br/projetos
 *
 * absoluteUrl("projetos")
 * → https://www.peredadev.com.br/projetos
 */
export function absoluteUrl(path = "/"): string {
  const normalizedPath =
    path.startsWith("/") ? path : `/${path}`;

  return `${siteConfig.url}${normalizedPath}`;
}

/**
 * Representa um perfil social disponível no site.
 */
export type SocialLink = {
  label: string;
  href: string;
  key: "linkedin" | "github";
};

/**
 * Retorna somente os perfis sociais configurados.
 */
export function socialLinks(): SocialLink[] {
  const links: SocialLink[] = [];

  if (siteConfig.social.github) {
    links.push({
      label: "GitHub",
      href: siteConfig.social.github,
      key: "github",
    });
  }

  if (siteConfig.social.linkedin) {
    links.push({
      label: "LinkedIn",
      href: siteConfig.social.linkedin,
      key: "linkedin",
    });
  }

  return links;
}