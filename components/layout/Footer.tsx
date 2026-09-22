import Link from "next/link";

import { TrackedLink } from "@/components/ui/TrackedLink";
import {
  siteConfig,
  socialLinks,
} from "@/lib/config/site";

import styles from "./Footer.module.css";

export function Footer() {
  const socials = socialLinks();

  return (
    <footer className={styles.footer}>
      <div
        className={`container ${styles.inner}`}
      >
        <div className={styles.id}>
          <p className={styles.name}>
            {siteConfig.name}
          </p>

          <p className={styles.role}>
            {siteConfig.role}
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <ul className={styles.links}>
            <li>
              <Link href="/projetos">
                Projetos
              </Link>
            </li>

            <li>
              <Link href="/sobre">
                Sobre
              </Link>
            </li>

            <li>
              <Link href="/contato">
                Contato
              </Link>
            </li>

            {socials.map((social) => (
              <li key={social.key}>
                <TrackedLink
                  href={social.href}
                  event={
                    social.key === "github"
                      ? "click_github"
                      : "click_linkedin"
                  }
                  eventParams={{
                    cta_location: "footer",
                    cta_name: social.label,
                  }}
                >
                  {social.label}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </nav>

        <p className={styles.legal}>
          © {new Date().getFullYear()}{" "}
          {siteConfig.name} · {siteConfig.city} —{" "}
          {siteConfig.region} ·{" "}
          <Link href="/privacidade">
            Privacidade
          </Link>
        </p>
      </div>
    </footer>
  );
}