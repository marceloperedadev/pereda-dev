import { siteConfig } from "@/lib/config/site";

export const DEFAULT_WA_MESSAGE =
  "Olá, Marcelo! Vi seu portfólio em pereda.dev e gostaria de conversar sobre um projeto.";

export function whatsappUrl(
  message: string = DEFAULT_WA_MESSAGE,
): string {
  const encodedMessage =
    encodeURIComponent(message);

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`;
}

export function projectWhatsappMessage(
  projectName: string,
): string {
  return `Olá, Marcelo! Vi o projeto ${projectName} no seu portfólio (pereda.dev) e gostaria de conversar sobre um projeto parecido.`;
}

export function mailtoUrl(
  subject = "Contato pelo portfólio",
  body = "",
): string {
  const params = new URLSearchParams();

  params.set("subject", subject);

  if (body) {
    params.set("body", body);
  }

  return `mailto:${siteConfig.email}?${params.toString()}`;
}