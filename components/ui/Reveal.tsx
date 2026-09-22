"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type Props = Readonly<{
  children: ReactNode;
  delay?: number;
  className?: string;
}>;

type RevealStyle = CSSProperties & {
  "--d": string;
};

/**
 * Entrada discreta de conteúdo.
 *
 * A animação é controlada pelo atributo `data-reveal`
 * definido em globals.css. Sem JavaScript ou quando o
 * usuário prefere menos movimento, o conteúdo permanece
 * visível normalmente.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    if (reducedMotionQuery.matches) {
      element.dataset.in = "true";
      return;
    }

    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      element.dataset.in = "true";
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              continue;
            }

            const target =
              entry.target as HTMLElement;

            target.dataset.in = "true";

            observer.unobserve(target);
          }
        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -6% 0px",
        },
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const revealStyle: RevealStyle = {
    "--d": `${Math.max(0, delay)}ms`,
  };

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={revealStyle}
    >
      {children}
    </div>
  );
}