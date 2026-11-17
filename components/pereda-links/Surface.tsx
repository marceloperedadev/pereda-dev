"use client";

import { useEffect } from "react";

type Props = Readonly<{
  color: string;
}>;

/**
 * Ajusta o fundo do documento para acompanhar a superfície da página.
 *
 * As páginas Pereda Links vivem fora do chrome do site e têm
 * superfícies próprias (tinta ou papel). Sem isso, o overscroll
 * revelaria o fundo escuro padrão do portfólio.
 */
export function Surface({ color }: Props) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtml = html.style.backgroundColor;
    const previousBody = body.style.backgroundColor;

    html.style.backgroundColor = color;
    body.style.backgroundColor = color;

    return () => {
      html.style.backgroundColor = previousHtml;
      body.style.backgroundColor = previousBody;
    };
  }, [color]);

  return null;
}
