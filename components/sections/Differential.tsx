import { ProjectCover } from "@/components/ui/ProjectCover";
import { Reveal } from "@/components/ui/Reveal";
import { SectionRule } from "@/components/ui/SectionRule";

import { differential } from "@/lib/content/home";
import { getProject } from "@/lib/data/projects";

import styles from "./Differential.module.css";

export function Differential() {
  const engineering = getProject("pereda-engenharia");

  return (
    <section
      className={styles.section}
      aria-labelledby="diff-title"
    >
      <div className="container">
        <SectionRule label="Diferencial" />

        <div className={styles.head}>
          <h2 id="diff-title" className={styles.title}>
            {differential.title}
          </h2>

          <p className={styles.lead}>{differential.lead}</p>
        </div>

        <ul className={styles.grid}>
          <li className={`${styles.card} ${styles.number}`}>
            <Reveal className={styles.fill}>
              <p className={styles.big} aria-hidden="true">
                1
              </p>

              <h3 className={styles.cardTitle}>
                Uma pessoa responsável pelo projeto
              </h3>

              <p className={styles.text}>
                A comunicação acontece diretamente comigo, do entendimento
                inicial às decisões de interface e desenvolvimento.
              </p>
            </Reveal>
          </li>

          <li className={`${styles.card} ${styles.image}`}>
            <div className={styles.imageBox}>
              {engineering ? (
                <ProjectCover
                  project={engineering}
                  sizes="(min-width: 1024px) 34vw, 90vw"
                />
              ) : null}
            </div>

            <div className={styles.overlay}>
              <h3 className={styles.cardTitle}>
                Interface e operação no mesmo projeto
              </h3>

              <p className={styles.text}>
                No desenvolvimento de um e-commerce ou sistema, a experiência
                de quem usa precisa conversar com a estrutura que sustenta a
                operação.
              </p>
            </div>
          </li>

          <li className={`${styles.card} ${styles.tall}`}>
            <Reveal className={styles.fill} delay={80}>
              <h3 className={styles.cardTitle}>
                Pensamento de longo prazo
              </h3>

              <p className={styles.text}>
                A estrutura deve permitir ajustes, evolução e manutenção sem
                transformar cada mudança em um novo projeto do zero.
              </p>
            </Reveal>
          </li>

          <li className={`${styles.card} ${styles.wide}`}>
            <Reveal className={styles.fill}>
              <h3 className={styles.cardTitle}>
                Experiência antes do excesso
              </h3>

              <p className={styles.text}>
                Conteúdo, navegação e chamadas para ação precisam ajudar o
                visitante a entender o negócio e encontrar o próximo passo.
              </p>
            </Reveal>
          </li>

          <li className={`${styles.card} ${styles.small}`}>
            <Reveal className={styles.fill} delay={60}>
              <h3 className={styles.cardTitle}>Performance</h3>

              <p className={styles.text}>
                Peso de páginas, imagens, scripts e carregamento fazem parte
                das decisões técnicas do projeto.
              </p>
            </Reveal>
          </li>

          <li className={`${styles.card} ${styles.small}`}>
            <Reveal className={styles.fill} delay={120}>
              <h3 className={styles.cardTitle}>
                Estrutura e integração
              </h3>

              <p className={styles.text}>
                Quando o projeto precisa de APIs, banco de dados, WhatsApp,
                e-mail ou outros serviços, essas conexões fazem parte da
                construção.
              </p>
            </Reveal>
          </li>
        </ul>
      </div>
    </section>
  );
}