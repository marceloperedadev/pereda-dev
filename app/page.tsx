import type { Metadata } from "next";

import { JsonLd } from "@/components/ui/JsonLd";

import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Differential } from "@/components/sections/Differential";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";

import { siteConfig } from "@/lib/config/site";

import { homeGraph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

const homeTitle = `${siteConfig.name} | ${siteConfig.role} em ${siteConfig.city}, ${siteConfig.region}`;

export const metadata: Metadata =
  buildMetadata({
    title: homeTitle,

    description:
      "Marcelo Felipe trabalha com presença digital, e-commerce e experiências digitais para negócios, marcas e profissionais em Taubaté e remotamente.",

    path: "/",
  });

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeGraph()} />

      <Hero />

      <Projects />

      <Differential />

      <Process />

      <About />

      <Contact location="home_contact" />
    </>
  );
}
