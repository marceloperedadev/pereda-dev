import type { CSSProperties, ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
  delay?: number;
  className?: string;
}>;

type RevealStyle = CSSProperties & {
  "--reveal-delay": string;
};

export function Reveal({ children, delay = 0, className }: Props) {
  const style: RevealStyle = {
    "--reveal-delay": `${Math.max(0, delay)}ms`,
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
