import { ButtonLink } from "@/components/ui/ButtonLink";
import { TrackedLink } from "@/components/ui/TrackedLink";

import { ctaParams } from "@/lib/analytics/events";
import { siteConfig } from "@/lib/config/site";
import { contact } from "@/lib/content/home";
import { mailtoUrl, whatsappUrl } from "@/lib/utils/contact";

import styles from "./Contact.module.css";

type ContactProps = {
  location?: string;
};

export function Contact({
  location = "contact_section",
}: ContactProps) {
  return (
    <section
      id="contato"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className="container">
        <p className={styles.kicker}>
          <span className={styles.dot} aria-hidden="true" />
          {contact.kicker}
        </p>

        <h2 id="contact-title" className={styles.title}>
          {contact.title}
        </h2>

        <div className={styles.row}>
          <div className={styles.copy}>
            <p className={styles.text}>{contact.text}</p>

            <div className={styles.actions}>
              <ButtonLink
                href={whatsappUrl()}
                variant="primary"
                arrow
                event="click_whatsapp"
                eventParams={ctaParams(location, contact.primaryCta)}
              >
                {contact.primaryCta}
              </ButtonLink>

              <ButtonLink
                href="/contato"
                variant="secondary"
                event="start_contact"
                eventParams={ctaParams(location, "Iniciar um projeto")}
              >
                Iniciar um projeto
              </ButtonLink>
            </div>
          </div>

          <dl className={styles.channels}>
            <div>
              <dt>WhatsApp</dt>
              <dd>
                <TrackedLink
                  href={whatsappUrl()}
                  event="click_whatsapp"
                  eventParams={ctaParams(
                    `${location}_channels`,
                    "WhatsApp",
                  )}
                >
                  {siteConfig.whatsappDisplay}
                </TrackedLink>
              </dd>
            </div>

            <div>
              <dt>E-mail</dt>
              <dd>
                <TrackedLink
                  href={mailtoUrl()}
                  event="click_email"
                  eventParams={ctaParams(
                    `${location}_channels`,
                    "E-mail",
                  )}
                >
                  {siteConfig.email}
                </TrackedLink>
              </dd>
            </div>

            <div>
              <dt>Onde</dt>
              <dd>
                {siteConfig.city} — {siteConfig.region}
              </dd>
            </div>

            <div className={styles.commercial}>
              <dt>{siteConfig.commercial.availability}</dt>
              <dd>Atendimento sob escopo · Brasil · remoto</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}