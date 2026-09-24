import Link from "next/link";

import styles from "./Disclosure.module.css";

export function Disclosure() {
  return (
    <aside className={styles.disclosure} aria-label="Transparência sobre links externos">
      <p>Links afiliados podem gerar comissão, sem custo adicional. A oferta do Redragon Fizz não tem preço nem estoque verificados; as demais fichas são ilustrativas.</p>
      <nav aria-label="Mais informações">
        <Link href="/setup/transparencia">Transparência</Link>
        <Link href="/setup/metodologia">Metodologia</Link>
      </nav>
    </aside>
  );
}
