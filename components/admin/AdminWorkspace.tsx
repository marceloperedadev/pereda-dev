"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, Package } from "lucide-react";

import styles from "./AdminWorkspace.module.css";

const sections = [
  { href: "/admin/analytics", label: "Visão geral", detail: "Analytics", icon: BarChart3 },
  { href: "/admin/projetos", label: "Projetos", detail: "Cases e URLs", icon: BriefcaseBusiness },
  { href: "/admin/produtos", label: "Produtos", detail: "Curadoria", icon: Package },
] as const;

export function AdminWorkspace({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.workspace}>
      <div className={styles.frame}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>PEREDA DIGITAL / ADMINISTRAÇÃO</p>
            <p className={styles.workspaceName}>Centro de gestão</p>
          </div>
          <Link className={styles.siteLink} href="/">
            Ver site <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </header>

        <nav className={styles.navigation} aria-label="Seções administrativas">
          {sections.map(({ href, label, detail, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin/analytics" && pathname.startsWith(href));

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`${styles.navLink} ${active ? styles.active : ""}`}
                href={href}
                key={href}
              >
                <Icon aria-hidden="true" className={styles.navIcon} size={19} strokeWidth={1.8} />
                <span className={styles.navText}>
                  <strong>{label}</strong>
                  <small>{detail}</small>
                </span>
                <ArrowUpRight aria-hidden="true" className={styles.navArrow} size={15} />
              </Link>
            );
          })}
        </nav>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}