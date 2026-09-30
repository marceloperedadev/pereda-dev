import type { Metadata } from "next";
import { AnalyticsAdmin } from "@/components/admin/AnalyticsAdmin";
import { isAdminAuthenticated, isAnalyticsConfigured } from "@/lib/server/analytics-auth";

export const metadata: Metadata = { title: "Analytics | Admin Pereda Dev", robots: { index: false, follow: false, noarchive: true } };

export const dynamic = "force-dynamic";

export default async function AnalyticsAdminPage() {
  const authenticated = await isAdminAuthenticated();
  const configured = isAnalyticsConfigured();
  return <main className="container"><AnalyticsAdmin initialAuthenticated={authenticated} initialConfigured={configured} /></main>;
}
