import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MessageCircle,
} from "lucide-react";

import { JsonLd } from "@/components/ui/JsonLd";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { DemoPreview } from "@/components/pereda-links/DemoPreview";
import { PageIndex } from "@/components/pereda-links/PageIndex";
import { Surface } from "@/components/pereda-links/Surface";
import { SolutionsGrid } from "@/components/solutions/SolutionsGrid";

import {
  PL_DIFFERENTIALS,
  PL_FAQ,
  PL_FINAL_TEXT,
  PL_FINAL_TITLE,
  PL_HIRE_TEXT,
  PL_PRICE_TEXT,
  PL_SCOPE,
  PL_SCOPE_NOTE,
  PL_SEGMENTS,
  PL_STEPS,
} from "@/lib/content/pereda-links";
import { absoluteUrl, siteConfig } from "@/lib/config/site";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { ctaParams } from "@/lib/analytics/events";
import { whatsappUrl } from "@/lib/utils/contact";

import styles from "./page.module.css";
import motionStyles from "./motion.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Pereda Links — Páginas de links autorais para marcas e profissionais",
  description:
    "Páginas de links personalizadas, interativas e com identidade visual própria. Uma das três frentes da Pereda Dev, ao lado de sites institucionais e lojas virtuais.",
  path: "/pereda-links",
});

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbSchema([
      { name: "Início", path: "/" },
      { name: "Pereda Links", path: "/pereda-links" },
    ]),
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl("/pereda-links")}#page`,
      name: "Pereda Links",
      url: absoluteUrl("/pereda-links"),
      inLanguage: siteConfig.lang,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#person` },
    },
  ],
};

const pad = (value: number) => String(value).padStart(2, "0");

function SectionHead({
  index,
  label,
  meta,
  titleId,
  title,
  lead,
}: {
  index: string;
  label: string;
  meta?: string;
  titleId: string;
  title: ReactNode;
  lead?: string;
}) {
  return (
    <header className={styles.sectionHead}>
      <div className={styles.sectionTop}>
        <span className={styles.sectionIndex}>{index}</span>
        <span className={styles.sectionLabel}>{label}</span>
        {meta ? <span className={styles.sectionMeta}>{meta}</span> : null}
      </div>

      <h2 id={titleId} className={styles.sectionTitle}>
        {title}
      </h2>

      {lead ? <p className={styles.sectionLead}>{lead}</p> : null}
    </header>
  );
}

function PageNav() {
  return (
    <header className={styles.siteNav}>
      <div className={`container ${styles.navInner}`}>
        <Link href="/" className={styles.navBrand} aria-label="Pereda Dev — site oficial">
          <span className={styles.navMark} aria-hidden="true">
            P
          </span>
          <span className={styles.navBrandName}>Pereda Dev</span>
        </Link>

        <span className={styles.navProduct}>/ Pereda Links</span>

        <nav className={styles.navLinks} aria-label="Seções desta página">
          <a href="#frentes">Frentes</a>
          <a href="#experiencia">Demonstração</a>
          <a href="#diferenciais">Diferenciais</a>
          <a href="#investimento">Investimento</a>
          <a href="#perguntas">Perguntas</a>
        </nav>

        <div className={styles.navActions}>
          <TrackedLink
            href={whatsappUrl()}
            className={styles.navCta}
            event="click_whatsapp"
            eventParams={ctaParams("pereda_links_nav", "WhatsApp")}
          >
            WhatsApp
            <ArrowUpRight size={15} strokeWidth={1.9} aria-hidden="true" />
          </TrackedLink>

          <PageIndex />
        </div>

        <span className={styles.navProgress} aria-hidden="true" />
      </div>
    </header>
  );
}

export default function PeredaLinksPage() {
  return (
    <div className={`${styles.page} ${motionStyles.pageMotion}`} id="top">
      <Surface color="#f1ede3" />
      <JsonLd data={graph} />
      <PageNav />

      {/* =====================================================
          CAPA
          ===================================================== */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <span className={styles.heroFolio} aria-hidden="true">
          01 — Capa
        </span>

        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              Pereda Links
              <span className={styles.eyebrowIndex}>Edição 01</span>
            </p>

            <h1 id="hero-title" className={styles.heroTitle}>
              Sua presença digital começa <em>no primeiro clique.</em>
            </h1>

            <p className={styles.heroLead}>
              Transformamos o link da bio em uma experiência digital de marca:
              mais clareza, mais personalidade e mais caminho para o próximo passo.
            </p>

            <div className={styles.heroActions}>
              <TrackedLink
                href="/links/pereda-dev"
                className={styles.btnAcid}
                event="click_hero"
                eventParams={ctaParams(
                  "hero_pereda_links",
                  "Experimentar demonstração",
                )}
              >
                Experimentar demonstração
                <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
              </TrackedLink>

              <TrackedLink
                href={whatsappUrl()}
                className={styles.btnLine}
                event="click_hero"
                eventParams={ctaParams("hero_pereda_links", "Solicitar minha página")}
              >
                Solicitar minha página
              </TrackedLink>
            </div>

            <dl className={styles.heroFacts}>
              <div>
                <dt>A partir de</dt>
                <dd>R$ 99,99</dd>
              </div>
              <div>
                <dt>Formato</dt>
                <dd>Página autoral</dd>
              </div>
              <div>
                <dt>Publicação</dt>
                <dd>No escopo</dd>
              </div>
            </dl>
          </div>

        </div>

        <div className={styles.heroRule} aria-hidden="true">
          <span>Páginas de links autorais</span>
          <span>Pereda Dev · Taubaté — SP</span>
          <span>Vol. 01 · {new Date().getFullYear()}</span>
        </div>
      </section>

      {/* =====================================================
          FRENTES DE TRABALHO
          ===================================================== */}
      <section
        className={styles.frentes}
        id="frentes"
        aria-labelledby="frentes-title"
      >
        <div className="container">
          <SectionHead
            index="01"
            label="Frentes de trabalho"
            meta="Sites · Lojas · Links"
            titleId="frentes-title"
            title={
              <>
                Presença digital <em>para cada etapa da marca.</em>
              </>
            }
            lead="A Pereda Dev cria experiências digitais para empresas e profissionais que precisam apresentar a marca com clareza, autoridade e propósito comercial."
          />

          <SolutionsGrid variant="commercial" />
        </div>
      </section>

      {/* =====================================================
          PROBLEMA
          ===================================================== */}
      <section
        className={styles.problem}
        id="problema"
        aria-labelledby="problem-title"
      >
        <div className="container">
          <SectionHead
            index="02"
            label="O problema"
            meta="Link padrão × presença digital"
            titleId="problem-title"
            title={
              <>
                A maioria das bios ainda <em>parece improvisada.</em>
              </>
            }
            lead="Listas genéricas de botões não comunicam valor. Quando a presença digital parece genérica, a marca perde a chance de ser lembrada e de converter interesse em conversa."
          />

          <div className={styles.compareGrid}>
            <article className={styles.compareOld}>
              <header className={styles.compareHead}>
                <span className={styles.compareTag}>Link tradicional</span>
                <span className={styles.compareMeta}>Formato padrão</span>
              </header>

              <div className={styles.oldStack} aria-hidden="true">
                {["Meu site", "Instagram", "WhatsApp", "Catálogo"].map(
                  (label) => (
                    <span key={label}>{label}</span>
                  ),
                )}
              </div>

              <ul className={styles.oldList}>
                <li>Apresentação genérica.</li>
                <li>Links sem identidade.</li>
                <li>Pouca personalidade.</li>
                <li>Experiência limitada.</li>
              </ul>
            </article>

            <article className={styles.compareNew}>
              <header className={styles.compareHead}>
                <span className={styles.compareTagNew}>Pereda Links</span>
                <span className={styles.compareMeta}>Página autoral</span>
              </header>

              <div className={styles.compareMini}>
                <p>Veja a experiência real da Pereda Dev.</p>
                <Link href="/links/pereda-dev">
                  Abrir demonstração completa
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>

              <ul className={styles.newList}>
                <li>Identidade visual própria.</li>
                <li>Experiência pensada para a marca.</li>
                <li>Interações personalizadas.</li>
                <li>Navegação intuitiva.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          PARA QUEM É
          ===================================================== */}
      <section
        className={styles.segments}
        id="segmentos"
        aria-labelledby="segments-title"
      >
        <div className="container">
          <SectionHead
            index="03"
            label="Para quem é"
            meta="Seis pontos de partida"
            titleId="segments-title"
            title={
              <>
                A presença ideal para <em>marcas em crescimento.</em>
              </>
            }
            lead="Ideal para profissionais, marcas e negócios que precisam de uma apresentação digital própria, de alto nível e sem a complexidade de um site completo."
          />

          <ul className={styles.segmentGrid}>
            {PL_SEGMENTS.map((item, index) => (
              <li className={styles.segmentCard} key={item.name}>
                <span className={styles.segmentNo}>{pad(index + 1)}</span>
                <h3 className={styles.segmentName}>{item.name}</h3>
                <p className={styles.segmentIdea}>{item.idea}</p>
                <span className={styles.segmentArrow} aria-hidden="true">
                  ↗
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =====================================================
          DEMONSTRAÇÃO
          ===================================================== */}
      <section
        className={styles.demo}
        id="experiencia"
        aria-labelledby="demo-title"
      >
        <div className="container">
          <SectionHead
            index="04"
            label="Demonstração"
            meta="Projeto próprio · demonstração real"
            titleId="demo-title"
            title={
              <>
                Explore uma experiência <em>em funcionamento.</em>
              </>
            }
            lead="A demonstração abaixo é a própria presença digital da Pereda Dev. Navegue por ela e veja como projetos, apresentação e contato podem funcionar em uma página autoral."
          />

          <DemoPreview />
        </div>
      </section>

      {/* =====================================================
          DIFERENCIAIS
          ===================================================== */}
      <section
        className={styles.differentials}
        id="diferenciais"
        aria-labelledby="diff-title"
      >
        <div className={`container ${styles.split}`}>
          <div className={styles.splitHead}>
            <SectionHead
              index="05"
              label="Diferenciais"
              meta="O que muda na prática"
              titleId="diff-title"
              title={
                <>
                  Um produto de marca, <em>não um molde genérico.</em>
                </>
              }
              lead="O Pereda Links não é uma lista de botões com sua logo. É uma presença digital pensada para mostrar identidade, reforçar confiança e abrir conversas mais qualificadas."
            />
          </div>

          <ul className={styles.diffList}>
            {PL_DIFFERENTIALS.map((item, index) => (
              <li className={styles.diffRow} key={item.title}>
                <span className={styles.diffNo}>{pad(index + 1)}</span>
                <h3 className={styles.diffName}>{item.title}</h3>
                <p className={styles.diffText}>{item.text}</p>
                <span className={styles.diffArrow} aria-hidden="true">
                  →
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =====================================================
          PROCESSO
          ===================================================== */}
      <section
        className={styles.process}
        id="processo"
        aria-labelledby="process-title"
      >
        <div className="container">
          <SectionHead
            index="06"
            label="Como funciona"
            meta="Quatro etapas"
            titleId="process-title"
            title={
              <>
                Simples, claro e <em>com direção.</em>
              </>
            }
            lead="Um processo objetivo, com acompanhamento em cada etapa e uma rodada de ajustes final para deixar a presença digital pronta para o uso real."
          />

          <ol className={styles.steps}>
            {PL_STEPS.map((step) => (
              <li className={styles.step} key={step.number}>
                <span className={styles.stepNo}>{step.number}</span>
                <h3 className={styles.stepName}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =====================================================
          INVESTIMENTO
          ===================================================== */}
      <section
        className={styles.invest}
        id="investimento"
        aria-labelledby="invest-title"
      >
        <div className={`container ${styles.investGrid}`}>
          <div className={styles.investCopy}>
            <SectionHead
              index="07"
              label="Escopo e contratação"
              meta="O que está incluído"
              titleId="invest-title"
              title={
                <>
                  Uma presença digital <em>com identidade própria.</em>
                </>
              }
              lead={PL_PRICE_TEXT}
            />

            <p className={styles.price}>
              <span className={styles.priceUnit}>a partir de</span>
              <span className={styles.priceCurrency}>R$</span>
              <span className={styles.priceValue}>99,99</span>
            </p>

            <div className={styles.investActions}>
              <TrackedLink
                href={whatsappUrl()}
                className={styles.btnAcid}
                event="click_invest"
                eventParams={ctaParams(
                  "invest_pereda_links",
                  "Solicitar minha página",
                )}
              >
                Solicitar minha página
                <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
              </TrackedLink>

              <TrackedLink
                href="/links/pereda-dev"
                className={styles.btnOutlineLight}
                event="click_invest"
                eventParams={ctaParams(
                  "invest_pereda_links",
                  "Experimentar demonstração",
                )}
              >
                Experimentar demonstração
              </TrackedLink>
            </div>

            <p className={styles.hireNote}>{PL_HIRE_TEXT}</p>
            <p className={styles.scopeNote}>{PL_SCOPE_NOTE}</p>
          </div>

          <div className={styles.scopeCard}>
            <div className={styles.scopeHead}>
              <span>O escopo inclui</span>
              <span>{pad(PL_SCOPE.length)} itens</span>
            </div>

            <ul className={styles.scopeList}>
              {PL_SCOPE.map((item) => (
                <li key={item}>
                  <Check size={15} strokeWidth={2.2} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =====================================================
          PERGUNTAS
          ===================================================== */}
      <section
        className={styles.faq}
        id="perguntas"
        aria-labelledby="faq-title"
      >
        <div className={`container ${styles.faqGrid}`}>
          <div className={styles.faqHead}>
            <SectionHead
              index="08"
              label="Perguntas frequentes"
              meta="Antes de começar"
              titleId="faq-title"
              title={
                <>
                  Dados claros, <em>sem ruído.</em>
                </>
              }
              lead="Tudo o que você precisa saber antes de decidir: escopo, diferença entre soluções, funcionamento e entrega."
            />

            <div className={styles.faqHelp}>
              <p>Não encontrou sua dúvida?</p>
              <TrackedLink
                href={whatsappUrl()}
                event="click_contact"
                eventParams={ctaParams("faq_pereda_links", "Falar no WhatsApp")}
              >
                Falar no WhatsApp
                <ArrowUpRight size={15} strokeWidth={1.9} aria-hidden="true" />
              </TrackedLink>
            </div>
          </div>

          <div className={styles.faqList}>
            {PL_FAQ.map((item) => (
              <details className={styles.faqItem} key={item.question}>
                <summary className={styles.faqQuestion}>
                  <span>{item.question}</span>
                  <span className={styles.faqMarker} aria-hidden="true" />
                </summary>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FECHAMENTO
          ===================================================== */}
      <section className={styles.final} aria-labelledby="final-title">
        <div className={`container ${styles.finalGrid}`}>
          <div className={styles.finalCopy}>
            <p className={styles.finalKicker}>Fim · Pereda Links</p>
            <h2 id="final-title" className={styles.finalTitle}>
              {PL_FINAL_TITLE}
            </h2>
            <p className={styles.finalText}>{PL_FINAL_TEXT}</p>
          </div>

          <div className={styles.finalActions}>
            <TrackedLink
              href={whatsappUrl()}
              className={styles.btnAcid}
              event="click_final"
              eventParams={ctaParams("final_pereda_links", "Solicitar minha página")}
            >
              Solicitar minha página
              <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
            </TrackedLink>

            <TrackedLink
              href="/links/pereda-dev"
              className={styles.btnOutlineLight}
              event="click_final"
              eventParams={ctaParams(
                "final_pereda_links",
                "Experimentar demonstração",
              )}
            >
              Experimentar demonstração
            </TrackedLink>

            <p className={styles.finalNote}>
              A conversa começa pelo canal que for mais fácil para você.
            </p>
          </div>
        </div>

        <div className={`container ${styles.finalFooter}`}>
          <span>© {new Date().getFullYear()} Pereda Dev</span>
          <Link href="/">Site oficial</Link>
          <a href="#top">Voltar ao topo ↑</a>
        </div>
      </section>

      {/* Ações persistentes no celular */}
      <div className={styles.mobileBar} aria-label="Ações rápidas">
        <TrackedLink
          href={whatsappUrl()}
          className={styles.mobileWa}
          event="click_whatsapp"
          eventParams={ctaParams("pereda_links_mobile_bar", "WhatsApp")}
        >
          <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
          WhatsApp
        </TrackedLink>

        <TrackedLink
          href="/links/pereda-dev"
          className={styles.mobileDemo}
          event="click_demo_link"
          eventParams={ctaParams(
            "pereda_links_mobile_bar",
            "Experimentar demonstração",
          )}
        >
          Demonstração
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </TrackedLink>
      </div>
    </div>
  );
}
