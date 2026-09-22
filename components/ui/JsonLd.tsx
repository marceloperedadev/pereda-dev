
import type { ReactElement } from "react";

type JsonLdPrimitive =
  | string
  | number
  | boolean
  | null;

type JsonLdValue =
  | JsonLdPrimitive
  | JsonLdValue[]
  | {
      [key: string]: JsonLdValue | undefined;
    };

type Props = Readonly<{
  data: JsonLdValue;
}>;

export function JsonLd({
  data,
}: Props): ReactElement {
  const json = JSON.stringify(data).replace(
    /</g,
    "\\u003c",
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: json,
      }}
    />
  );
}