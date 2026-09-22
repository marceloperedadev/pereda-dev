import type { ComponentProps } from "react";
import { ArrowRight } from "lucide-react";

import { TrackedLink } from "./TrackedLink";

import styles from "./ButtonLink.module.css";

type Props = ComponentProps<typeof TrackedLink> & {
  variant?: "primary" | "secondary" | "text";
  arrow?: boolean;
};

export function ButtonLink({
  variant = "primary",
  arrow = false,
  className,
  children,
  ...props
}: Props) {
  const classes = [
    styles.btn,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TrackedLink
      {...props}
      className={classes}
    >
      <span>{children}</span>

      {arrow ? (
        <ArrowRight
          className={styles.arrow}
          size={18}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : null}
    </TrackedLink>
  );
}