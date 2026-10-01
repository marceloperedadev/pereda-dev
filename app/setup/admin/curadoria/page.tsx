import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Gestão de curadoria | Pereda Dev",
  robots: { index: false, follow: false, noarchive: true },
};

export default function CurationAdminPage() {
  redirect("/admin/produtos");
}
