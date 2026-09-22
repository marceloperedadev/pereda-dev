"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ReactNode,
} from "react";

import {
  track,
  type EventName,
  type EventParams,
} from "@/lib/analytics/events";

type Props = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> & {
  href: string;
  event?: EventName;
  eventParams?: EventParams;
  children: ReactNode;
};

/**
 * Link com rastreamento opcional.
 *
 * Links internos usam next/link.
 * Links externos abrem em nova aba por padrão e recebem
 * rel="noopener noreferrer", enquanto mailto: e tel:
 * permanecem na mesma aba.
 */
export function TrackedLink({
  href,
  event,
  eventParams,
  children,
  target,
  rel,
  ...rest
}: Props) {
  const handleClick = () => {
    if (event) {
      track(event, eventParams);
    }
  };

  const isInternal =
    href.startsWith("/") ||
    href.startsWith("#");

  if (isInternal) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  const isMailto = href.startsWith("mailto:");
  const isTel = href.startsWith("tel:");
  const sameTab = isMailto || isTel;

  return (
    <a
      href={href}
      onClick={handleClick}
      target={
        sameTab
          ? undefined
          : target ?? "_blank"
      }
      rel={
        sameTab
          ? undefined
          : rel ?? "noopener noreferrer"
      }
      {...rest}
    >
      {children}
    </a>
  );
}