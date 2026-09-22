import type { Metadata } from "next";

import { JsonLd } from "@/components/ui/JsonLd";

import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Differential } from "@/components/sections/Differential";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Proof } from "@/components/sections/Proof";
import { Stack } from "@/components/sections/Stack";

import { siteConfig } from "@/lib/config/site";

import { homeGraph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

const homeTitle = `${siteConfig.name} | ${siteConfig.role} em ${siteConfig.city}, ${siteConfig.region}`;

export const metadata: Metadata =
  buildMetadata({
    title: homeTitle,

    description:
      "Desenvolvedor Full Stack em Taubaté, SP. Crio sites profissionais, lojas virtuais e sistemas web para empresas, negócios locais e profissionais.",

    path: "/",
  });

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeGraph()} />

      <Hero />

      <Proof />

      <Projects />

      <Process />

      <Stack />

      <Differential />

      <About />

      <Contact location="home_contact" />
    </>
  );
}