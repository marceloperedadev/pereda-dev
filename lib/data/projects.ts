export type ProjectCoverArt = {
  variant:
    | "mimoPet"
    | "peredaEngenharia"
    | "ortoclinica"
    | "draValesca";
  bg: string;
  fg: string;
  accent: string;
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  type: string;
  h1: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  execution: string;
  objective: string;
  features: readonly string[];
  decisions: readonly string[];
  tags: readonly string[];
  stack: readonly string[];
  url: string;
  updatedAt: string;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
    art: ProjectCoverArt;
  };
};

export const projects = [
  {
    slug: "mimo-pet",
    name: "Mimo Pet",
    category: "Estética animal e pet coffee",
    type: "Site e loja virtual",
    h1: "Mimo Pet — site, loja virtual e experiência digital",
    shortDescription:
      "Uma experiência digital para apresentar o espaço, os serviços e a loja da Mimo Pet.",
    description:
      "Projeto desenvolvido para uma operação que reúne estética animal, pet coffee e loja. A proposta foi organizar diferentes necessidades em uma experiência digital clara, com apresentação do espaço, serviços e produtos.",
    problem:
      "O negócio precisava apresentar seus serviços, o espaço físico e a loja de forma organizada, sem transformar a experiência em uma página institucional genérica.",
    solution:
      "A estrutura foi pensada para conectar apresentação do negócio, serviços, produtos e contato em uma navegação simples e orientada às ações mais importantes.",
    execution:
      "O projeto reúne interface responsiva, páginas de conteúdo, catálogo de produtos, carrinho e fluxo de checkout, além da estrutura necessária para publicação e manutenção do projeto.",
    objective:
      "Criar uma presença digital capaz de apresentar o negócio e também apoiar a operação de vendas online.",
    features: [
      "Apresentação do espaço",
      "Serviços de estética animal",
      "Pet coffee",
      "Loja virtual",
      "Catálogo de produtos",
      "Carrinho de compras",
      "Checkout",
      "Contato e atendimento",
    ],
    decisions: [
      "Separação clara entre apresentação do espaço, serviços e loja.",
      "Navegação pensada para reduzir caminhos desnecessários.",
      "Experiência responsiva para uso principalmente em dispositivos móveis.",
      "Estrutura preparada para integração com dados e operação real.",
    ],
    tags: [
      "E-commerce",
      "Site profissional",
      "Negócio local",
      "Pet",
      "Loja virtual",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    url: "https://belocao-site-finalizado.vercel.app/",
    updatedAt: "2026-09-22",
    cover: {
      src: "/projects/mimo-pet.webp",
      alt: "Site Mimo Pet apresentado em uma tela de computador",
      width: 1600,
      height: 1000,
      art: {
        variant: "mimoPet",
        bg: "#eee5f4",
        fg: "#342039",
        accent: "#672f96",
      },
    },
  },

  {
    slug: "pereda-engenharia",
    name: "Pereda Engenharia",
    category: "Engenharia civil",
    type: "Landing page profissional",
    h1: "Pereda Engenharia — presença digital para engenharia civil",
    shortDescription:
      "Uma landing page profissional criada para apresentar a atuação da empresa, seus serviços e facilitar o contato com potenciais clientes.",
    description:
      "Projeto desenvolvido para uma empresa de engenharia civil, com foco em apresentar seus serviços de forma clara, transmitir credibilidade e criar um caminho direto entre a descoberta da empresa e o contato.",
    problem:
      "Uma empresa de engenharia precisa comunicar seus serviços e diferenciais de maneira objetiva, sem depender de uma estrutura institucional excessivamente complexa ou difícil de navegar.",
    solution:
      "A experiência foi estruturada para apresentar a empresa, contextualizar sua atuação e destacar os principais serviços, utilizando uma hierarquia visual clara e chamadas para contato distribuídas de forma estratégica.",
    execution:
      "O projeto reúne uma landing page responsiva, estrutura semântica, apresentação dos serviços, informações institucionais e pontos de conversão preparados para diferentes tamanhos de tela.",
    objective:
      "Criar uma presença digital profissional para fortalecer a apresentação da empresa e facilitar o contato de novos potenciais clientes.",
    features: [
      "Apresentação da empresa",
      "Serviços de engenharia civil",
      "Apresentação profissional",
      "Seções institucionais",
      "Chamadas para contato",
      "Experiência responsiva",
      "Estrutura orientada a SEO",
    ],
    decisions: [
      "Hierarquia visual baseada em clareza e credibilidade.",
      "Conteúdo organizado para facilitar a compreensão dos serviços.",
      "CTAs posicionados próximos aos momentos de decisão.",
      "Interface responsiva para diferentes dispositivos.",
      "Estrutura pensada para apresentação profissional da empresa.",
    ],
    tags: [
      "Engenharia",
      "Engenharia civil",
      "Landing page",
      "Site profissional",
      "Negócio local",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    url: "https://pereda-engenharia.vercel.app/",
    updatedAt: "2026-09-22",
    cover: {
      src: "/projects/pereda-engenharia.webp",
      alt: "Site da Pereda Engenharia apresentado em uma tela de computador",
      width: 1600,
      height: 1000,
      art: {
        variant: "peredaEngenharia",
        bg: "#110c15",
        fg: "#f5f2f7",
        accent: "#b8ff00",
      },
    },
  },

  {
    slug: "ortoclinica-taubate",
    name: "Ortoclínica Taubaté",
    category: "Clínica em Taubaté",
    type: "Site institucional",
    h1: "Ortoclínica Taubaté — presença digital para uma clínica",
    shortDescription:
      "Um site institucional estruturado para apresentar a clínica, suas áreas de atendimento e facilitar o contato.",
    description:
      "Projeto desenvolvido para organizar a presença digital de uma clínica e tornar mais clara a apresentação de seus serviços, áreas de atendimento e formas de contato.",
    problem:
      "Informações de serviços e atendimento precisam ser apresentadas de forma objetiva para que o visitante consiga entender rapidamente a clínica e encontrar o próximo passo.",
    solution:
      "A estrutura foi organizada em torno de informações essenciais, áreas de atendimento e chamadas para contato, com atenção especial à experiência em dispositivos móveis.",
    execution:
      "O projeto conta com estrutura institucional, seções de conteúdo, chamadas para contato, navegação responsiva e organização semântica das informações.",
    objective:
      "Facilitar o entendimento da clínica e transformar o site em um ponto de contato mais claro para novos visitantes.",
    features: [
      "Apresentação institucional",
      "Áreas de atendimento",
      "Informações sobre a clínica",
      "Chamadas para contato",
      "Navegação responsiva",
      "Estrutura orientada a SEO",
    ],
    decisions: [
      "Conteúdo organizado pela necessidade do visitante.",
      "Destaque para informações de atendimento.",
      "CTAs posicionados próximos aos momentos de decisão.",
      "Estrutura preparada para navegação em dispositivos móveis.",
    ],
    tags: [
      "Saúde",
      "Clínica",
      "Site institucional",
      "SEO local",
      "Taubaté",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    url: "https://ortoclinica-taubate.vercel.app/",
    updatedAt: "2026-09-21",
    cover: {
      src: "/projects/ortoclinica-taubate.webp",
      alt: "Site institucional da Ortoclínica Taubaté apresentado em uma tela de computador",
      width: 1600,
      height: 1000,
      art: {
        variant: "ortoclinica",
        bg: "#f5f2f7",
        fg: "#342039",
        accent: "#8b3d32",
      },
    },
  },

  {
    slug: "dra-valesca",
    name: "Dra. Valesca",
    category: "Odontologia",
    type: "Site institucional",
    h1: "Dra. Valesca — site profissional para odontologia",
    shortDescription:
      "Um site profissional desenvolvido como modelo de presença digital para apresentar a atuação da dentista e facilitar o contato com novos pacientes.",
    description:
      "Projeto desenvolvido como modelo de presença digital para uma profissional da área odontológica, com foco em apresentação profissional, clareza das informações e facilidade de contato.",
    problem:
      "A presença digital precisava transmitir profissionalismo sem dificultar o acesso às informações e ao contato.",
    solution:
      "A interface foi organizada para apresentar a profissional, seus serviços e informações relevantes de forma objetiva, com chamadas de contato distribuídas ao longo da experiência.",
    execution:
      "O projeto reúne estrutura institucional, apresentação profissional, informações de atendimento, chamadas para contato e experiência responsiva.",
    objective:
      "Criar uma presença digital profissional que facilite a compreensão dos serviços e o contato com a dentista.",
    features: [
      "Apresentação profissional",
      "Serviços odontológicos",
      "Informações institucionais",
      "Chamadas para contato",
      "Layout responsivo",
      "Estrutura orientada a SEO",
    ],
    decisions: [
      "Hierarquia visual voltada para confiança e clareza.",
      "Conteúdo organizado para facilitar a leitura.",
      "Chamadas para contato posicionadas de forma natural.",
      "Experiência adaptada para dispositivos móveis.",
    ],
    tags: [
      "Odontologia",
      "Profissional liberal",
      "Site institucional",
      "SEO local",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    url: "https://site-dentista-phi.vercel.app/",
    updatedAt: "2026-09-22",
    cover: {
      src: "/projects/dra-valesca.webp",
      alt: "Site institucional da Dra. Valesca apresentado em uma tela de computador",
      width: 1600,
      height: 1000,
      art: {
        variant: "draValesca",
        bg: "#f5f2f7",
        fg: "#342039",
        accent: "#672f96",
      },
    },
  },
] as const satisfies readonly Project[];

/**
 * Retorna um projeto pelo slug.
 */
export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/**
 * Retorna a URL interna de um projeto.
 */
export function projectPath(slug: string) {
  return `/projetos/${slug}`;
}

/**
 * Retorna os demais projetos, excluindo o projeto atual.
 */
export function otherProjects(currentSlug: string) {
  return projects.filter(
    (project) => project.slug !== currentSlug
  );
}