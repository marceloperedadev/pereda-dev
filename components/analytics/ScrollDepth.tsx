"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  track,
  type EventName,
} from "@/lib/analytics/events";

const THRESHOLDS: {
  pct: number;
  event: EventName;
}[] = [
  {
    pct: 0.5,
    event: "scroll_50",
  },
  {
    pct: 0.75,
    event: "scroll_75",
  },
  {
    pct: 0.9,
    event: "scroll_90",
  },
];

/**
 * Mede profundidade de rolagem uma única vez por página.
 *
 * Utiliza:
 * - listener passivo;
 * - requestAnimationFrame;
 * - Set para evitar eventos duplicados.
 *
 * Páginas muito curtas não geram eventos de profundidade.
 */
export function ScrollDepth() {
  const pathname = usePathname();

  useEffect(() => {
    const fired =
      new Set<EventName>();

    let animationFrameId: number | null =
      null;

    const checkScrollDepth = () => {
      animationFrameId = null;

      const documentElement =
        document.documentElement;

      const totalHeight =
        documentElement.scrollHeight;

      const viewportHeight =
        window.innerHeight;

      /**
       * Evita registrar profundidade em páginas
       * que praticamente não possuem rolagem.
       */
      if (
        totalHeight <=
        viewportHeight * 1.1
      ) {
        return;
      }

      const visiblePosition =
        window.scrollY +
        viewportHeight;

      const depth =
        visiblePosition /
        totalHeight;

      for (const threshold of THRESHOLDS) {
        if (
          depth >= threshold.pct &&
          !fired.has(threshold.event)
        ) {
          fired.add(
            threshold.event,
          );

          track(
            threshold.event,
            {
              page_path: pathname,
            },
          );
        }
      }
    };

    const handleScroll = () => {
      if (
        animationFrameId !== null
      ) {
        return;
      }

      animationFrameId =
        window.requestAnimationFrame(
          checkScrollDepth,
        );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    /**
     * Executa uma verificação inicial.
     *
     * Isso cobre casos em que a página já
     * possui uma posição de scroll restaurada
     * pelo navegador.
     */
    checkScrollDepth();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );

      if (
        animationFrameId !== null
      ) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
      }
    };
  }, [pathname]);

  return null;
}