import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/ui/ContactForm";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrackedLink } from "@/components/ui/TrackedLink";

import { ctaParams } from "@/lib/analytics/events";
import { absoluteUrl, siteConfig, socialLinks } from "@/lib/config/site";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { mailtoUrl, whatsappUrl } from "@/lib/utils/contact";

import styles from "./page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Contato | Marcelo Felipe — E-commerce e experiências digitais",
  description:
    "Entre em contato com Marcelo Felipe para conversar sobre presença digital, e-commerce e experiências digitais para negócios e marcas.",
  path: "/contato",
});

export default function ContactPage() {
  const socials = socialLinks();

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([
        { name: "Início", path: "/" },
        { name: "Contato", path: "/contato" },
      ]),
      {
        "@type": "ContactPage",
        "@id": `${absoluteUrl("/contato")}#page`,
        name: "Contato",
        url: absoluteUrl("/contato"),
        inLanguage: siteConfig.lang,
        isPartOf: {
          "@id": `${siteConfig.url}/#website`,
        },
        about: {
          "@id": `${siteConfig.url}/#person`,
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={graph} />

      <PageHeader
        title="Vamos conversar sobre o seu projeto?"
        lead="Se você já sabe o que precisa ou ainda está tentando entender o melhor caminho, podemos começar por uma conversa."
      />

      <section
        className={`container ${styles.grid}`}
        aria-labelledby="contact-form-title"
      >
        <div className={styles.formCol}>
          <h2 id="contact-form-title" className={styles.h2}>
            Conte o essencial
          </h2>

          <p>
            Explique brevemente o que você precisa, o que já existe e qual
            objetivo gostaria de alcançar. A partir disso, podemos entender o
            próximo passo.
          </p>

          <ContactForm />
        </div>

        <aside className={styles.channels} aria-labelledby="contact-direct-title">
          <h2 id="contact-direct-title" className={styles.h2}>
            Ou fale direto
          </h2>

          <ul className={styles.list}>
            <li>
              <span className={styles.label}>WhatsApp</span>

              <TrackedLink
                href={whatsappUrl()}
                event="click_whatsapp"
                eventParams={ctaParams("contact_page", "WhatsApp")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.whatsappDisplay}
              </TrackedLink>
            </li>

            <li>
              <span className={styles.label}>E-mail</span>

              <TrackedLink
                href={mailtoUrl()}
                event="click_email"
                eventParams={ctaParams("contact_page", "E-mail")}
              >
                {siteConfig.email}
              </TrackedLink>
            </li>

            <li>
              <span className={styles.label}>Localização</span>

              <span>
                {siteConfig.city} — {siteConfig.region}
              </span>
            </li>

            {socials.map((social) => (
              <li key={social.key}>
                <span className={styles.label}>{social.label}</span>

                <TrackedLink
                  href={social.href}
                  event={
                    social.key === "github"
                      ? "click_github"
                      : "click_linkedin"
                  }
                  eventParams={ctaParams("contact_page", social.label)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir perfil de ${siteConfig.name} no ${social.label}`}
                >
                  Abrir perfil
                </TrackedLink>
              </li>
            ))}
          </ul>

          <p className={styles.more}>
            Quer conhecer meu trabalho antes de entrar em contato?{" "}
            <Link href="/projetos">Veja os projetos</Link> ou{" "}
            <Link href="/sobre">conheça meu processo</Link>.
          </p>
        </aside>
      </section>
    </>
  );
}