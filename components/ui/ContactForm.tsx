"use client";

import {
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ArrowRight } from "lucide-react";

import { ctaParams, track } from "@/lib/analytics/events";
import { whatsappUrl } from "@/lib/utils/contact";

import styles from "./ContactForm.module.css";

const TYPES = [
  "Site institucional",
  "Loja virtual (e-commerce)",
  "Sistema sob medida",
  "Ainda não sei",
] as const;

const MAX_NAME_LENGTH = 100;
const MAX_ABOUT_LENGTH = 1200;

/**
 * Briefing curto que monta a mensagem e abre o WhatsApp.
 *
 * Os dados preenchidos não são enviados para um servidor próprio
 * nem armazenados pelo site. Eles são utilizados apenas para
 * montar a mensagem que será encaminhada ao WhatsApp.
 */
export function ContactForm() {
  const uid = useId();
  const started = useRef(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>(
    TYPES[0],
  );
  const [about, setAbout] = useState("");

  const markStart = () => {
    if (started.current) {
      return;
    }

    started.current = true;

    track(
      "start_contact",
      ctaParams(
        "contact_form",
        "Briefing",
      ),
    );
  };

  const onSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedAbout = about.trim();

    const lines = [
      `Olá, Marcelo! ${
        trimmedName
          ? `Meu nome é ${trimmedName}. `
          : ""
      }Vim pelo seu portfólio (pereda.dev).`,
      `Tipo de projeto: ${type}.`,
      trimmedAbout
        ? `Sobre o projeto: ${trimmedAbout}`
        : "",
    ].filter(Boolean);

    const message = lines.join("\n");

    track(
      "submit_contact",
      {
        ...ctaParams(
          "contact_form",
          "Enviar pelo WhatsApp",
        ),
        project_type: type,
      },
    );

    track(
      "click_whatsapp",
      ctaParams(
        "contact_form",
        "Enviar pelo WhatsApp",
      ),
    );

    window.open(
      whatsappUrl(message),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      onFocus={markStart}
    >
      <div className={styles.field}>
        <label htmlFor={`${uid}-name`}>
          Seu nome
        </label>

        <input
          id={`${uid}-name`}
          name="nome"
          type="text"
          autoComplete="name"
          maxLength={MAX_NAME_LENGTH}
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${uid}-type`}>
          Tipo de projeto
        </label>

        <select
          id={`${uid}-type`}
          name="tipo"
          value={type}
          onChange={(event) =>
            setType(
              event.target.value as (typeof TYPES)[number],
            )
          }
          required
        >
          {TYPES.map((projectType) => (
            <option
              key={projectType}
              value={projectType}
            >
              {projectType}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${uid}-about`}>
          Conte em poucas linhas o que você precisa{" "}
          <span className={styles.opt}>
            (opcional)
          </span>
        </label>

        <textarea
          id={`${uid}-about`}
          name="sobre"
          rows={4}
          maxLength={MAX_ABOUT_LENGTH}
          value={about}
          onChange={(event) =>
            setAbout(event.target.value)
          }
        />
      </div>

      <button
        type="submit"
        className={styles.submit}
      >
        <span>Enviar pelo WhatsApp</span>

        <ArrowRight
          size={18}
          aria-hidden="true"
        />
      </button>

      <p className={styles.note}>
        Nada é salvo aqui: a mensagem é montada neste
        navegador e encaminhada para o WhatsApp quando
        você envia.
      </p>
    </form>
  );
}