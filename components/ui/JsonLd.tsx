type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | {
      [key: string]: JsonLdValue;
    };

type Props = {
  data: JsonLdValue;
};

/**
 * Insere dados estruturados JSON-LD na página.
 *
 * O caractere "<" é escapado antes da inserção no script
 * para evitar que o conteúdo possa ser interpretado como
 * uma tag HTML de fechamento.
 */
export function JsonLd({ data }: Props) {
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