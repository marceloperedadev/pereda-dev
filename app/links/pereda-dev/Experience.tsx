import Image from "next/image";
import {
  ArrowDownRight,
  ArrowUpRight,
  Github,
  Globe2,
  Linkedin,
  Mail,
  MessageCircle,
} from "lucide-react";

import { TrackedLink } from "@/components/ui/TrackedLink";
import { ProjectGallery } from "./ProjectGallery";
import { ctaParams } from "@/lib/analytics/events";
import { siteConfig, socialLinks } from "@/lib/config/site";
import { mailtoUrl, whatsappUrl } from "@/lib/utils/contact";

import styles from "./page.module.css";

const mainChannels = [
  {
    label: "Site institucional",
    href: "/",
    event: "click_link" as const,
    icon: Globe2,
  },
  {
    label: "Portfólio completo",
    href: "/projetos",
    event: "click_link" as const,
    icon: ArrowDownRight,
  },
];

export function Experience() {
  const social = socialLinks();

  return (
    <div className={styles.root} id="top">
      <a href="#conteudo-links" className={styles.skip}>
        Ir para o conteúdo
      </a>

      <header className={styles.header}>
        <TrackedLink
          href="/"
          className={styles.brand}
          aria-label="Pereda Dev — site institucional"
          event="click_link"
          eventParams={ctaParams("links_header", "Site institucional")}
        >
          <span className={styles.brandMark} aria-hidden="true">
            P
          </span>
          <span>Pereda Dev</span>
        </TrackedLink>

        <TrackedLink
          href={whatsappUrl()}
          className={styles.headerContact}
          event="click_whatsapp"
          eventParams={ctaParams("links_header", "WhatsApp")}
        >
          <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>WhatsApp</span>
        </TrackedLink>
      </header>

      <div id="conteudo-links" className={styles.main}>
        <section className={styles.identity} aria-labelledby="identity-title">
          <div className={styles.identityGrid}>
            <figure className={styles.portrait}>
              <div className={styles.portraitImage}>
                <Image
                  src={siteConfig.photo}
                  alt={siteConfig.photoAlt}
                  fill
                  priority
                  sizes="(max-width: 620px) 100vw, 56vw"
                />
              </div>
              <figcaption>Marcelo Felipe <span>·</span> Pereda Dev</figcaption>
            </figure>

            <div className={styles.identityCopy}>
              <p className={styles.eyebrow}>
                <span className={styles.signal} aria-hidden="true" />
                Taubaté, SP <span aria-hidden="true">/</span> atendimento remoto
              </p>

              <h1 id="identity-title" className={styles.name}>
                Marcelo <em>Felipe</em>
              </h1>

              <p className={styles.role}>Desenvolvedor Full Stack</p>
              <p className={styles.positioning}>
                Desenvolvimento web com identidade e intenção.
              </p>

              <div className={styles.identityActions}>
                <TrackedLink
                  href="#trabalhos"
                  className={styles.workJump}
                  event="click_hero"
                  eventParams={ctaParams("links_identity", "Ver trabalhos")}
                >
                  Ver trabalhos
                  <ArrowDownRight size={17} strokeWidth={1.8} aria-hidden="true" />
                </TrackedLink>
              </div>
            </div>

          </div>

          <div className={styles.identityRule}>
            <span>Sites</span>
            <span aria-hidden="true">·</span>
            <span>E-commerce</span>
            <span aria-hidden="true">·</span>
            <span>Experiências digitais</span>
          </div>
        </section>

        <section
          id="trabalhos"
          className={styles.work}
          aria-labelledby="work-title"
        >
          <header className={styles.sectionHead}>
            <p className={styles.sectionIndex}>01 / Trabalhos</p>
            <h2 id="work-title">Trabalho real, feito para cada marca.</h2>
            <p className={styles.sectionLead}>
              Três experiências publicadas, cada uma com seu próprio contexto e identidade.
            </p>
          </header>

          <ProjectGallery />

          <TrackedLink
            href="/projetos"
            className={styles.portfolioLink}
            event="click_link"
            eventParams={ctaParams("links_projects", "Portfólio completo")}
          >
            Ver portfólio completo
            <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </TrackedLink>
        </section>

        <section
          id="canais"
          className={styles.connections}
          aria-labelledby="connections-title"
        >
          <header className={styles.sectionHead}>
            <p className={styles.sectionIndex}>02 / Conexões</p>
            <h2 id="connections-title">Encontre a Pereda Dev.</h2>
          </header>

          <ul className={styles.channelList}>
            {mainChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <li key={channel.label}>
                  <TrackedLink
                    href={channel.href}
                    event={channel.event}
                    eventParams={ctaParams("links_channels", channel.label)}
                  >
                    <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                    <span>{channel.label}</span>
                    <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
                  </TrackedLink>
                </li>
              );
            })}

            {social.map((item) => {
              const Icon = item.key === "github" ? Github : Linkedin;
              const event = item.key === "github" ? "click_github" : "click_linkedin";

              return (
                <li key={item.key}>
                  <TrackedLink
                    href={item.href}
                    event={event}
                    eventParams={ctaParams("links_channels", item.label)}
                  >
                    <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                    <span>{item.label}</span>
                    <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
                  </TrackedLink>
                </li>
              );
            })}
          </ul>
          <p className={styles.productNote}>
            Este cartão é uma demonstração do{" "}
            <TrackedLink
              href="/pereda-links"
              event="click_link"
              eventParams={ctaParams("links_channels", "Conhecer Pereda Links")}
            >
              Pereda Links <ArrowUpRight size={13} aria-hidden="true" />
            </TrackedLink>
          </p>
        </section>

        <section
          id="contato"
          className={styles.contact}
          aria-labelledby="contact-title"
        >
          <div className={styles.contactCopy}>
            <p className={styles.sectionIndex}>03 / Contato</p>
            <h2 id="contact-title">
              Tem um projeto <em>em mente?</em>
            </h2>
            <p>
              Me conte o que você está construindo. A conversa começa direto,
              sem formulário ou etapas desnecessárias.
            </p>
          </div>

          <div className={styles.contactActions}>
            <TrackedLink
              href={whatsappUrl()}
              className={styles.whatsapp}
              event="click_whatsapp"
              eventParams={ctaParams("links_contact", "Chamar no WhatsApp")}
            >
              <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
              Chamar no WhatsApp
              <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
            </TrackedLink>

            <TrackedLink
              href={mailtoUrl()}
              className={styles.email}
              event="click_email"
              eventParams={ctaParams("links_contact", "Enviar e-mail")}
            >
              <Mail size={16} strokeWidth={1.7} aria-hidden="true" />
              {siteConfig.email}
            </TrackedLink>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Pereda Dev</span>
        <span>Taubaté, SP</span>
        <TrackedLink
          href="/pereda-links"
          event="click_link"
          eventParams={ctaParams("links_footer", "Conhecer Pereda Links")}
        >
          Pereda Links
        </TrackedLink>
        <a href="#top">Voltar ao início</a>
      </footer>
    </div>
  );
}
