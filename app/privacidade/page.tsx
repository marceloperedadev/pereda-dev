import type { Metadata } from "next";
import Link from "next/link";

import { ConsentPreferences } from "@/components/ui/ConsentPreferences";
import { PageHeader } from "@/components/ui/PageHeader";

import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

import styles from "./page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Política de privacidade",
  description:
    "Informações sobre privacidade, contato e medição de audiência neste site.",
  path: "/privacidade",
  index: false,
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Política de privacidade"
        lead="Um resumo direto sobre os dados tratados neste site, as ferramentas utilizadas e as escolhas disponíveis para você."
      />

      <div className="container">
        <div className={styles.prose}>
          <section aria-labelledby="p1">
            <h2 id="p1">O que este site coleta</h2>

            <p>
              Este site não possui cadastro público. Com seu consentimento, ele
              registra estatísticas de navegação em um banco próprio, usando
              identificadores aleatórios no navegador. O formulário de briefing
              monta a mensagem localmente e a encaminha ao WhatsApp; nome e texto
              do briefing não são enviados ao banco de analytics.
            </p>

            <p>
              Na página <Link href="/contato">Contato</Link>, os botões de WhatsApp e
              e-mail direcionam a conversa para serviços externos. As informações
              que você decidir enviar nesses canais serão tratadas de acordo com
              o funcionamento e as políticas dos respectivos serviços.
            </p>
          </section>

          <section aria-labelledby="p2">
            <h2 id="p2">Analytics e medição de uso</h2>

            <p>
              O Google Analytics e a medição própria só registram dados depois
              do consentimento. A medição própria guarda identificadores de
              sessão e visitante, páginas, eventos permitidos, origem/UTMs e
              categorias gerais de dispositivo e navegador. O IP não é salvo;
              o User-Agent é processado no servidor e descartado. Referrers são
              reduzidos à origem. Dados do formulário não são incluídos nos
              eventos. O tratamento pelo Google também segue suas políticas.
            </p>

            <p>
              Você pode alterar ou retirar sua escolha de consentimento a
              qualquer momento:
            </p>

            <ConsentPreferences />
          </section>

          <section aria-labelledby="p3">
            <h2 id="p3">Contato por WhatsApp ou e-mail</h2>

            <p>
              Quando você decide entrar em contato, as informações que enviar
              serão utilizadas para responder à sua mensagem e conduzir a
              conversa relacionada ao projeto.
            </p>

            <p>
              O site não mantém um cadastro próprio dessas conversas. Depois
              que a comunicação é encaminhada para WhatsApp ou e-mail, o
              tratamento das informações também depende dos respectivos
              serviços e das ações realizadas durante a conversa.
            </p>

            <p>
              Para dúvidas sobre o tratamento das informações pelo responsável
              pelo site, entre em contato pelo endereço{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </section>

          <section aria-labelledby="p4">
            <h2 id="p4">Cookies e armazenamento local</h2>

            <p>
              A preferência e o identificador de visitante ficam no localStorage;
              o identificador de sessão e UTMs sanitizadas ficam no sessionStorage.
              Esses dados respeitam sua escolha e agrupam estatísticas, sem criar cadastro.
            </p>
          </section>

          <section aria-labelledby="p5">
            <h2 id="p5">Responsável pelo site</h2>

            <p>
              {siteConfig.name}, profissional de e-commerce e experiências digitais em{" "}
              {siteConfig.city} — {siteConfig.region}.
            </p>

            <p>
              E-mail:{" "}
              <a href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
