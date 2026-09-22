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
              Este site não possui cadastro, área de login ou formulário que
              envie dados para um banco de dados próprio. A navegação pode
              ocorrer sem que você forneça diretamente informações pessoais.
            </p>

            <p>
              Na página{" "}
              <Link href="/contato">Contato</Link>, os botões de WhatsApp e
              e-mail direcionam a conversa para serviços externos. As
              informações que você decidir enviar nesses canais serão tratadas
              de acordo com o funcionamento e as políticas dos respectivos
              serviços.
            </p>
          </section>

          <section aria-labelledby="p2">
            <h2 id="p2">Google Analytics 4</h2>

            <p>
              Este site pode utilizar o Google Analytics 4 para obter
              informações estatísticas sobre a utilização das páginas, dos
              projetos e de alguns elementos de contato.
            </p>

            <p>
              O Analytics não é carregado enquanto você não tiver dado
              consentimento para essa finalidade. Se você aceitar, a
              ferramenta poderá registrar eventos de navegação e interação
              configurados no site. O tratamento das informações pelo Google
              também está sujeito às políticas e condições do próprio
              serviço.
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
              A preferência relacionada ao Google Analytics é armazenada no
              navegador para que sua escolha seja respeitada nas próximas
              visitas. Esse armazenamento é utilizado para controlar a
              preferência de consentimento e não representa um cadastro de
              usuário no site.
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