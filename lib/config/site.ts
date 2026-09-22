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
  * - perfis sociais.
  */

const DEFAULT_SITE_URL = "https://pereda.dev";

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

  domain: "pereda.dev",

  url: normalizeSiteUrl(rawUrl),

  role: "Desenvolvedor Full Stack",

  specialty: "E-commerce e experiências digitais",

  lang: "pt-BR",

  locale: "pt_BR",

  email: "marcelopereda.dev@gmail.com",

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
   * Vazio = utilizar o tratamento editorial/monograma
   * definido pelo componente.
   */
  photo: "" as string,

  photoAlt:
    "Marcelo Felipe, desenvolvedor Full Stack em Taubaté, SP",

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
 * → https://pereda.dev/
 *
 * absoluteUrl("/projetos")
 * → https://pereda.dev/projetos
 *
 * absoluteUrl("projetos")
 * → https://pereda.dev/projetos
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