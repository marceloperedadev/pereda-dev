import Image from "next/image";
import type { CSSProperties } from "react";

import type { Project } from "@/lib/data/projects";

import styles from "./ProjectCover.module.css";

type Props = Readonly<{
  project: Pick<Project, "name" | "cover">;
  sizes?: string;
  priority?: boolean;
}>;

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
  const { cover, name } = project;

  if (cover.src) {
    return (
      <div className={styles.cover}>
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.img}
        />
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