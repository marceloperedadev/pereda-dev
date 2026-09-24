"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { track } from "@/lib/analytics/events";
import { getProduct } from "@/lib/data/setup";

import styles from "./SetupGuide.module.css";

const questions = [
  { key: "use", label: "Para que você usa o PC?", options: ["Jogar", "Estudar e trabalhar", "Jogar e estudar", "Criar conteúdo"] },
  { key: "game", label: "Que tipo de jogo você joga?", options: ["Jogos competitivos", "Jogos de aventura", "Jogos competitivos e aventura", "Jogos leves e casuais"] },
  { key: "resolution", label: "Qual resolução você quer?", options: ["1080p", "1440p", "4K", "Ainda não sei"] },
  { key: "budget", label: "Quanto pode investir agora?", options: ["1500", "2500", "4000", "6000", "10000", "Ainda não sei"] },
  { key: "existing", label: "O que você já possui?", options: ["Nada", "Só o computador", "Tenho monitor, teclado e mouse", "Tenho quase tudo"] },
  { key: "priority", label: "Qual prioridade vem primeiro?", options: ["Desempenho", "Aparência", "Organização", "Conforto"] },
  { key: "peripherals", label: "Precisa de periféricos?", options: ["Sim", "Só alguns", "Não"] },
  { key: "space", label: "Como é o seu ambiente?", options: ["Mesa compacta", "Espaço grande", "Mesa compartilhada"] },
  { key: "style", label: "Qual estilo combina com você?", options: ["Discreto", "RGB", "Colorido", "Misto"] },
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
      track("setup_guide_complete", { use: next.use, budget: next.budget, resolution: next.resolution });
    } else {
      setStep((current) => current + 1);
    }
  }

  const selected = useMemo(() => {
    const ids: string[] = [];
    const alreadyHasPeripherals = responses.existing === "Tenho monitor, teclado e mouse" || responses.existing === "Tenho quase tudo";
    const needsPeripherals = !alreadyHasPeripherals && responses.peripherals !== "Não";

    if (responses.use?.includes("Jogar") || responses.use === "Criar conteúdo") ids.push("ryzen-5-5600");
    if (responses.resolution === "1440p" || responses.resolution === "4K") ids.push("monitor-24-144");
    if (needsPeripherals) {
      if (responses.use?.includes("estudar") || responses.priority === "Organização") ids.push("teclado-redragon-fizz");
      if (responses.game?.includes("competitivos") || responses.priority === "Desempenho") ids.push("mouse-wireless-59");
      if (responses.use?.includes("trabalhar") || responses.use === "Criar conteúdo") ids.push("headset-anc");
    }
    return [...new Set(ids)].map(getProduct).filter((product) => product !== undefined);
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
          <span>Você informou {responses.resolution} e um limite de R$ {responses.budget}. O catálogo ainda não tem preços verificados; esta lista não confirma que os itens cabem no orçamento, são compatíveis ou foram testados. Veja a <Link href="/setup/metodologia">metodologia</Link>.</span>
        </div>
        {selected.length ? (
          <ol className={styles.components}>
            {selected.map((product, index) => (
              <li key={product.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><p>{product.category} / referência ilustrativa</p><h4>{product.name}</h4><small>{product.forWho}</small></div>
                <Link href={`/setup/produtos/${product.slug}?source=setup-guide`}>Ver limites e contexto ↗</Link>
              </li>
            ))}
          </ol>
        ) : <p className={styles.noMatches}>Ainda não há itens verificados adequados às respostas. Explore os <Link href="/setup/guias">guias de escolha</Link>.</p>}
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
      <p className={styles.note}>Orientação ilustrativa. Preços, disponibilidade, compatibilidade e desempenho não foram verificados para estes itens.</p>
    </div>
  );
}
