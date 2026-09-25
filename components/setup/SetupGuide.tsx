"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { track } from "@/lib/analytics/events";
import { getProduct, hasMercadoLivreOffer } from "@/lib/data/setup";

import styles from "./SetupGuide.module.css";

const questions = [
  { key: "use", label: "O que você quer fazer no computador?", options: ["Jogar", "Estudar e trabalhar", "Jogar e estudar", "Criar conteúdo"] },
  { key: "game", label: "Se joga, que tipo de jogo costuma jogar?", options: ["Jogos competitivos", "Jogos de aventura", "Jogos competitivos e aventura", "Jogos leves e casuais"] },
  { key: "resolution", label: "Qual resolução você pretende usar?", options: ["1080p", "1440p", "4K", "Ainda não sei"] },
  { key: "existing", label: "Quais itens você já tem?", options: ["Nenhum", "Só o computador", "Monitor, teclado e mouse", "Quase tudo"] },
  { key: "priority", label: "O que mais importa agora?", options: ["Desempenho", "Organização", "Conforto"] },
  { key: "peripherals", label: "Quer considerar periféricos nesta etapa?", options: ["Sim", "Só alguns", "Não"] },
] as const;

type AnswerKey = (typeof questions)[number]["key"];
type Answers = Partial<Record<AnswerKey, string>>;

export function SetupGuide() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Answers>({});
  const [complete, setComplete] = useState(false);

  function choose(value: string) {
    const question = questions[step];
    const next = { ...responses, [question.key]: value };
    setResponses(next);
    track("setup_guide_step", { step: step + 1, answer: value, question: question.key });

    if (step === questions.length - 1) {
      setComplete(true);
      track("setup_guide_complete", { use: next.use, resolution: next.resolution });
    } else {
      setStep((current) => current + 1);
    }
  }

  const selected = useMemo(() => {
    const ids: string[] = [];
    const alreadyHasPeripherals = responses.existing === "Monitor, teclado e mouse" || responses.existing === "Quase tudo";
    const needsPeripherals = !alreadyHasPeripherals && responses.peripherals !== "Não";

    const use = responses.use?.toLocaleLowerCase("pt-BR") ?? "";
    const needsHighResolution = responses.resolution === "1440p" || responses.resolution === "4K";
    if ((use.includes("jogar") || responses.use === "Criar conteúdo") && !needsHighResolution) ids.push("ryzen-5-5600");
    // A catalog item is shown as a monitor reference only when it matches the chosen resolution.
    if (responses.resolution === "1080p") ids.push("monitor-lg-ultragear-24g411a", "monitor-gamer-24-100");
    if (needsPeripherals) {
      if (use.includes("estudar") || responses.priority === "Organização") ids.push("teclado-redragon-fizz");
      if (responses.game?.includes("competitivos") || responses.priority === "Desempenho") ids.push("mouse-wireless-59");
      if (use.includes("trabalhar") || responses.use === "Criar conteúdo" || responses.priority === "Conforto") ids.push("headset-anc");
    }

    return [...new Set(ids)].map(getProduct).filter((product) => product !== undefined && hasMercadoLivreOffer(product));
  }, [responses]);

  function restart() {
    setResponses({});
    setStep(0);
    setComplete(false);
  }

  if (complete) {
    return (
      <div className={styles.result}>
        <div className={styles.resultIntro}>
          <p>Ponto de partida editorial</p>
          <h3>O que vale pesquisar a seguir</h3>
          <span>Com base no uso e na resolução informados, estes itens são referências para pesquisa. O catálogo ainda não tem preços verificados nem confirmação de compatibilidade ou testes. Veja a <Link href="/setup/metodologia">metodologia</Link>.</span>
        </div>
        {selected.length ? (
          <ol className={styles.components}>
            {selected.map((product, index) => (
              <li key={product.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><p>{product.category} / referência editorial</p><h4>{product.name}</h4><small>{product.forWho}</small></div>
                <Link href={`/setup/produtos/${product.slug}?source=setup-guide`}>Ver limites e contexto ↗</Link>
              </li>
            ))}
          </ol>
        ) : <p className={styles.noMatches}>Ainda não há referência adequada para todas as respostas. Explore os <Link href="/setup/guias">guias de escolha</Link> antes de comprar.</p>}
        {(responses.resolution === "1440p" || responses.resolution === "4K") && (responses.use?.toLocaleLowerCase("pt-BR").includes("jogar") || responses.use === "Criar conteúdo") ? <p className={styles.noMatches}>A configuração de PC do catálogo tem foco em 1080p e não será extrapolada para 1440p ou 4K.</p> : null}
        {responses.resolution === "1440p" || responses.resolution === "4K" ? <p className={styles.noMatches}>O catálogo ainda não tem monitores 1440p ou 4K identificados. Não vou sugerir um modelo Full HD para essa resolução.</p> : null}
        <button className={styles.restart} type="button" onClick={restart}>Refazer guia</button>
      </div>
    );
  }

  const question = questions[step];
  return (
    <div className={styles.guide}>
      <div className={styles.progress} role="progressbar" aria-label="Progresso do guia" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={step + 1}>
        <span style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>
      <p className={styles.step}>{String(step + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</p>
      <h3>{question.label}</h3>
      {step > 0 ? <button className={styles.back} type="button" onClick={() => setStep((current) => current - 1)}>← Voltar</button> : null}
      <div className={styles.options} role="group" aria-label={question.label}>
        {question.options.map((option) => <button key={option} type="button" onClick={() => choose(option)}>{option}</button>)}
      </div>
      <p className={styles.note}>Orientação inicial, não uma lista de compra. Preços, disponibilidade, compatibilidade e desempenho dos itens ainda não foram verificados.</p>
    </div>
  );
}
