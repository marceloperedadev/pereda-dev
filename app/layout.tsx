import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Newsreader } from "next/font/google";

import { Analytics } from "@/components/analytics/Analytics";
import { ScrollDepth } from "@/components/analytics/ScrollDepth";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/lib/config/site";

import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: `${siteConfig.name} | ${siteConfig.role} em ${siteConfig.city}, ${siteConfig.region}`,
    template: `%s | ${siteConfig.name}`,
  },

  description:
    "Desenvolvedor Full Stack em Taubaté, SP. Crio sites profissionais, lojas virtuais e sistemas web para empresas, negócios locais e profissionais.",

  applicationName: siteConfig.name,

  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],

  creator: siteConfig.name,
  publisher: siteConfig.name,

  alternates: {
    canonical: "/",
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.role} em ${siteConfig.city}, ${siteConfig.region}`,
    description:
      "Desenvolvedor Full Stack em Taubaté, SP. Crio sites profissionais, lojas virtuais e sistemas web para empresas, negócios locais e profissionais.",
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.role} em ${siteConfig.city}, ${siteConfig.region}`,
    description:
      "Desenvolvedor Full Stack em Taubaté, SP. Crio sites profissionais, lojas virtuais e sistemas web para empresas, negócios locais e profissionais.",
  },

  ...(siteConfig.googleVerification
    ? {
        verification: {
          google: siteConfig.googleVerification,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08070A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.lang}
      className={`${display.variable} ${serif.variable}`}
    >
      <body>
        <noscript>
          <style>{`
            [data-reveal] {
              opacity: 1 !important;
              transform: none !important;
            }
          `}</style>
        </noscript>

        <a href="#conteudo" className="skipLink">
          Ir para o conteúdo
        </a>

        <Header />

        <main id="conteudo">{children}</main>

        <Footer />

        <Analytics />

        <ScrollDepth />
      </body>
    </html>
  );
}