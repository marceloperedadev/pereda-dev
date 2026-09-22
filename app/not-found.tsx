import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Página não encontrada | Marcelo Felipe",
  description:
    "A página que você tentou acessar não foi encontrada. Volte ao início ou confira os projetos de Marcelo Felipe.",
  path: "/404",
  index: false,
});

export default function NotFound() {
  return (
    <>
      <PageHeader
        title="Essa página não existe."
        lead="O endereço pode ter mudado ou estar incorreto. Volte ao início ou veja os projetos."
      />

      <div
        className="container"
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          paddingBottom: 120,
        }}
      >
        <ButtonLink href="/" variant="primary">
          Voltar ao início
        </ButtonLink>

        <ButtonLink href="/projetos" variant="secondary">
          Ver projetos
        </ButtonLink>
      </div>
    </>
  );
}