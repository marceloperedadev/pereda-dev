"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/Footer";

export function SiteFooter() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/setup/admin") ||
    pathname === "/pereda-links" ||
    pathname.startsWith("/links/pereda-dev")
  ) {
    return null;
  }

  return <Footer />;
}