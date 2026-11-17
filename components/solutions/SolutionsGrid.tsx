"use client";

import { ArrowUpRight } from "lucide-react";

import { TrackedLink } from "@/components/ui/TrackedLink";
import { ctaParams } from "@/lib/analytics/events";
import { SOLUTIONS } from "@/lib/content/solutions";

import styles from "./SolutionsGrid.module.css";

type Props = Readonly<{
  variant: "commercial" | "links";
}>;

const variantContent = {
  commercial: {
    sites: {
      name: "Sites institucionais",
      tagline: "Credibilidade e presença",
      summary:
        "Estruturas claras para empresas e profissionais que precisam parecer confiáveis e objetivos desde o primeiro clique.",
      points: [
        "Narrativa de marca",
        "Estrutura editorial",
        "Credibilidade para conversão",
      ],
      evidence: "Projetos reais · presença de marca",
    },
    lojas: {
      name: "Lojas virtuais",
      tagline: "Venda com clareza",
      summary:
        "Experiências digitais que organizam catálogo, ofertas e decisão de compra sem atrito nem ruído visual.",
      points: [
        "Catálogo e posicionamento",
        "Jornada de compra",
        "Estratégia comercial",
      ],
      evidence: "Projetos reais · conversão e catálogo",
    },
    links: {
      name: "Páginas de links",
      tagline: "Marca em primeiro plano",
      summary:
        "Uma presença premium para apresentar sua marca, destacar canais e converter atenção em contato, clique e ação.",
      points: [
        "Identidade visual autoral",
        "Narrativa pensada para marca",
        "Contato e conversão em um só lugar",
      ],
      evidence: "Demonstração própria · Pereda Links",
    },
  },
  links: {
    sites: {
      name: "Sites institucionais",
      tagline: "Presença com peso",
      summary:
        "Ideal para quem quer falar com clareza, transmitir confiança e transformar visita em consideração real.",
      points: [
        "Arquitetura de marca",
        "Conteúdo com direção",
        "Credibilidade visual",
      ],
      evidence: "Estratégia e execução · sites reais",
    },
    lojas: {
      name: "Lojas virtuais",
      tagline: "Venda com estrutura",
      summary:
        "Um canal que organiza catálogo, oferta e decisão de compra com foco em clareza, velocidade e confiança.",
      points: [
        "Catálogo e apresentação",
        "Jornada de compra",
        "Crescimento com navegação clara",
      ],
      evidence: "Produtos e conversão · lojas reais",
    },
    links: {
      name: "Experiência de links",
      tagline: "Marca que conversa",
      summary:
        "Uma página autoral para consolidar canais, reforçar identidade e entregar uma primeira impressão mais premium.",
      points: [
        "Perfil visual distinto",
        "Canais em um só lugar",
        "Navegação pensada para ação",
      ],
      evidence: "Esta página · demonstração própria",
    },
  },
} as const;

export function SolutionsGrid({ variant }: Props) {
  const page = variant === "commercial" ? "pereda_links_frentes" : "links_solucoes";

  return (
    <div className={styles.wrapper}>
      <ul className={styles.grid}>
        {SOLUTIONS.map((solution) => {
          const isLinks = solution.key === "links";
          const content = variantContent[variant][solution.key];

          const action =
            isLinks && variant === "commercial"
              ? {
                  href: "/links/pereda-dev",
                  label: "Ver demonstração",
                }
              : isLinks
                ? {
                    href: "/pereda-links",
                    label: "Conhecer o Pereda Links",
                  }
                : {
                    href: solution.projectHref,
                    label: solution.projectCta,
                  };

          return (
            <li key={solution.key}>
              <article
                className={styles.card}
                data-current={isLinks ? "true" : undefined}
              >
                <div className={styles.top}>
                  <span className={styles.index}>{solution.index}</span>
                  <span className={styles.tagline}>{content.tagline}</span>
                  {isLinks ? (
                    <span className={styles.flag}>Você está aqui</span>
                  ) : null}
                </div>

                <div className={styles.body}>
                  <h3 className={styles.name}>{content.name}</h3>
                  <p className={styles.summary}>{content.summary}</p>

                  <ul className={styles.points}>
                    {content.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.foot}>
                  <span className={styles.evidence}>{content.evidence}</span>
                  <TrackedLink
                    href={action.href}
                    className={styles.action}
                    event="click_link"
                    eventParams={ctaParams(page, action.label)}
                  >
                    {action.label}
                    <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                  </TrackedLink>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <div className={styles.wrapperFoot}>
        {variant === "commercial" ? (
          <p className={styles.note}>
            Sites e lojas levam a projetos reais. A experiência de links é a
            demonstração da própria marca e da forma como a Pereda Dev pensa em presença digital.
          </p>
        ) : null}

        <nav className={styles.links} aria-label="Próximos passos">
          <TrackedLink
            href="/projetos"
            event="click_link"
            eventParams={ctaParams(page, "Explorar projetos")}
          >
            Explorar projetos
            <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
          </TrackedLink>

          <TrackedLink
            href="/contato"
            event="start_contact"
            eventParams={ctaParams(page, "Falar sobre um projeto")}
          >
            Falar sobre um projeto
          </TrackedLink>
        </nav>
      </div>
    </div>
  );
}
