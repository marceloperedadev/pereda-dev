import Image from "next/image";
import type { CSSProperties } from "react";

import type { Project } from "@/lib/data/projects";

import styles from "./ProjectCover.module.css";

type Props = Readonly<{
  project: Pick<Project, "slug" | "name" | "cover">;
  sizes?: string;
  priority?: boolean;
}>;

const liveCaptures: Record<string, { src: string; alt: string }> = {
  "mimo-pet": {
    src: "/projects/mimo-pet-live.webp",
    alt: "Captura real da página inicial publicada da Mimo Pet.",
  },
  "pereda-engenharia": {
    src: "/projects/pereda-engenharia-live.webp",
    alt: "Captura real da página inicial publicada da Pereda Engenharia.",
  },
  "ortoclinica-taubate": {
    src: "/projects/ortoclinica-taubate-live.webp",
    alt: "Captura real da página inicial publicada da Ortoclínica Taubaté.",
  },
};

type ArtStyle = CSSProperties & {
  "--bg-c": string;
  "--fg-c": string;
  "--ac-c": string;
};

/**
 * Ocupa 100% do elemento pai.
 *
 * Quando o projeto possui uma imagem real em `cover.src`,
 * utiliza o componente Image do Next.js para otimização.
 *
 * Quando não possui imagem, apresenta uma composição
 * tipográfica gerada em CSS. Essa composição é decorativa
 * e não adiciona informação à árvore de acessibilidade.
 */
export function ProjectCover({
  project,
  sizes = "(min-width: 1024px) 60vw, 90vw",
  priority = false,
}: Props) {
  const { cover, name, slug } = project;
  const liveCapture = liveCaptures[slug];
  const imageSrc = liveCapture?.src ?? cover.src;
  const imageAlt = liveCapture?.alt ?? cover.alt;
  const isIllustrative = !liveCapture && (
    cover.illustrative || /mockup ilustrativo/i.test(cover.alt)
  );

  if (imageSrc) {
    return (
      <div className={styles.cover}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.img}
        />
        {isIllustrative ? (
          <span className={styles.caption}>Mockup ilustrativo</span>
        ) : null}
      </div>
    );
  }

  const { art } = cover;

  const artStyle: ArtStyle = {
    "--bg-c": art.bg,
    "--fg-c": art.fg,
    "--ac-c": art.accent,
  };

  return (
    <div
      className={`${styles.cover} ${styles.art} ${styles[art.variant]}`}
      style={artStyle}
      aria-hidden="true"
    >
      <span className={styles.word}>
        {name}
      </span>
    </div>
  );
}
