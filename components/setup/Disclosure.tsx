import Link from "next/link";

import styles from "./Disclosure.module.css";

export function Disclosure() {
  return (
    <aside className={styles.disclosure} aria-label="Transparência sobre links externos">
      <p>Links identificados como afiliados podem gerar comissão, sem custo adicional para você. A compra e o atendimento são realizados no Mercado Livre pelo vendedor do anúncio; o Pereda Dev não é o vendedor. Confirme preço e estoque na loja.</p>
      <nav aria-label="Mais informações">
        <Link href="/setup/transparencia">Transparência</Link>
        <Link href="/setup/metodologia">Metodologia</Link>
      </nav>
    </aside>
  );
}
