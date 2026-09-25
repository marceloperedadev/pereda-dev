export type ProductCategory =
  | "PC"
  | "Monitor"
  | "Teclado"
  | "Mouse"
  | "Headset"
  | "Mousepad"
  | "Webcam"
  | "Microfone"
  | "Iluminação"
  | "Cadeira"
  | "Acessórios";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string;
  brand: string;
  image?: { src: string; alt: string };
  summary: string;
  forWho: string;
  notFor: string;
  specs: readonly { label: string; value: string }[];
  useCases: readonly string[];
  profile: "Econômico" | "Equilibrado" | "Desempenho" | "Premium";
  tags: readonly string[];
  compatibility?: readonly string[];
  offers: readonly ProductOffer[];
  status: "illustrative" | "verified" | "archived";
  editorialPriority?: number;
  sources?: readonly { label: string; url: string; accessedAt: string }[];
  updatedAt: string;
};

export type ProductOffer = {
  store: StoreName;
  price?: number;
  previousPrice?: number;
  currency?: "BRL";
  availability: "Atual" | "Sob consulta";
  productUrl?: string;
  affiliateUrl?: string;
  updatedAt: string;
};

/** Lojas que o hub está preparado para receber como ofertas. */
export const storeNames = ["Mercado Livre", "Amazon", "KaBuM!", "Terabyte"] as const;
export type StoreName = (typeof storeNames)[number];

/** Dados editoriais das lojas; links e preços são cadastrados por oferta, nunca presumidos. */
export const affiliateStores: readonly {
  name: StoreName;
  programUrl: string;
}[] = [
  { name: "Mercado Livre", programUrl: "https://www.mercadolivre.com.br/l/afiliados-home" },
  { name: "Amazon", programUrl: "https://associados.amazon.com.br/" },
  { name: "KaBuM!", programUrl: "https://www.kabum.com.br/hotsite/afiliados/" },
  { name: "Terabyte", programUrl: "https://landing.terabyteshop.com.br/parceiros" },
];

export type Setup = {
  slug: string;
  name: string;
  profile: string;
  focus: readonly string[];
  budget: string;
  description: string;
  productIds: readonly string[];
  searchTerms?: readonly string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  sections: readonly { title: string; content: string }[];
  productIds: readonly string[];
  updatedAt: string;
  index?: boolean;
  searchTerms?: readonly string[];
  sources?: readonly { label: string; url: string; accessedAt: string }[];
};

export type Game = {
  slug: string;
  name: string;
  genre: string;
  description: string;
  minimum: string;
  recommended: string;
  targets: readonly { label: string; detail: string }[];
  productIds: readonly string[];
  updatedAt: string;
};

export const products: readonly Product[] = [
  {
    id: "ryzen-5-5600",
    name: "AMD Ryzen 5 5600 + AMD Radeon RX 7600",
    slug: "pc-gamer-1080p-equilibrado",
    category: "PC",
    brand: "AMD",
    summary: "Uma base equilibrada para jogar em 1080p e manter espaço para upgrades.",
    forWho: "Quem busca um PC completo para gaming em 1080p sem concentrar o orçamento em uma única peça.",
    notFor: "Não é a escolha ideal para exigir 4K nativo ou ray tracing pesado com alta taxa de quadros.",
    specs: [
      { label: "Processador", value: "AMD Ryzen 5 5600" },
      { label: "Placa de vídeo", value: "AMD Radeon RX 7600" },
      { label: "Memória", value: "16 GB DDR4" },
      { label: "Armazenamento", value: "SSD NVMe de 1 TB" },
    ],
    useCases: ["Gaming", "Uso geral"],
    profile: "Equilibrado",
    tags: ["1080p", "gamer", "upgrades"],
    offers: [],
    status: "illustrative",
    updatedAt: "2026-09-21",
  },
  {
    id: "monitor-24-144",
    name: "Monitor 24” Full HD 144 Hz IPS",
    slug: "monitor-24-full-hd-144hz",
    category: "Monitor",
    brand: "Curadoria aberta",
    summary: "A combinação mais equilibrada para FPS e uso competitivo em 1080p.",
    forWho: "Quem quer reduzir a latência visual e jogar em alta frequência sem aumentar a resolução.",
    notFor: "Não atende bem quem busca máximo aproveitamento de mesa para trabalho criativo ou 4K.",
    specs: [
      { label: "Resolução", value: "1920 × 1080" },
      { label: "Taxa de atualização", value: "144 Hz" },
      { label: "Painel", value: "IPS" },
    ],
    useCases: ["Gaming", "Trabalho"],
    profile: "Equilibrado",
    tags: ["fps", "1080p", "competitivo"],
    offers: [],
    status: "illustrative",
    updatedAt: "2026-09-21",
  },
  {
    id: "monitor-gamer-24-100",
    name: "Monitor gamer 24\" Full HD IPS 100 Hz",
    slug: "monitor-gamer-24-full-hd-100hz",
    category: "Monitor",
    brand: "Não informado no anúncio",
    summary: "Anúncio de monitor 24\" Full HD com painel IPS e taxa anunciada de 100 Hz. Confirme marca, modelo e especificações na página da loja.",
    forWho: "Quem procura um monitor Full HD para jogos e uso geral e vai confirmar os detalhes do modelo antes da compra.",
    notFor: "Quem precisa de um modelo já identificado e com especificações verificadas para comparar desempenho.",
    specs: [
      { label: "Tamanho anunciado", value: "24 polegadas" },
      { label: "Resolução anunciada", value: "Full HD (1920 × 1080)" },
      { label: "Painel anunciado", value: "IPS" },
      { label: "Frequência anunciada", value: "100 Hz" },
      { label: "Resposta anunciada", value: "3 ms" },
      { label: "Recursos anunciados", value: "HDR e HDMI" },
    ],
    useCases: ["Gaming", "Uso geral"],
    profile: "Econômico",
    tags: ["monitor", "100hz", "full-hd", "ips"],
    offers: [
      {
        store: "Mercado Livre",
        availability: "Sob consulta",
        affiliateUrl: "https://meli.la/2VuYxGP",
        updatedAt: "2026-09-24",
      },
    ],
    status: "illustrative",
    sources: [
      {
        label: "Mercado Livre — anúncio de monitor gamer 24\" Full HD 100 Hz",
        url: "https://www.mercadolivre.com.br/monitor-gamer-24--ips-full-hd-100hz-3ms-hdr-hdmi-jogos-e-pc/up/MLBU5084204576?pdp_filters=item_id:MLB5171883451",
        accessedAt: "2026-09-24",
      },
    ],
    updatedAt: "2026-09-24",
  },
  {
    id: "monitor-lg-ultragear-24g411a",
    name: "LG UltraGear 24G411A-B 24\" Full HD 144 Hz",
    slug: "monitor-lg-ultragear-24g411a-144hz",
    category: "Monitor",
    brand: "LG",
    summary: "Monitor gamer LG UltraGear de 24\" com Full HD e 144 Hz, conforme o anúncio. Confira preço, disponibilidade e a variante exata na loja.",
    forWho: "Quem procura um monitor Full HD de alta frequência para jogos e quer avaliar um modelo de marca identificada.",
    notFor: "Quem precisa de resolução acima de Full HD ou de recursos confirmados por teste independente.",
    specs: [
      { label: "Modelo anunciado", value: "LG UltraGear 24G411A-B" },
      { label: "Tamanho anunciado", value: "24 polegadas" },
      { label: "Resolução anunciada", value: "Full HD (1920 × 1080)" },
      { label: "Frequência anunciada", value: "144 Hz" },
      { label: "Resposta anunciada", value: "1 ms MBR" },
      { label: "Recursos anunciados", value: "NVIDIA G-SYNC, AMD FreeSync e HDR10" },
    ],
    useCases: ["Gaming", "Trabalho"],
    profile: "Desempenho",
    tags: ["lg", "ultragear", "144hz", "full-hd", "ips"],
    offers: [
      {
        store: "Mercado Livre",
        availability: "Sob consulta",
        affiliateUrl: "https://meli.la/1D6vYQN",
        updatedAt: "2026-09-24",
      },
    ],
    status: "illustrative",
    sources: [
      {
        label: "Mercado Livre — anúncio do monitor LG UltraGear 24G411A-B",
        url: "https://www.mercadolivre.com.br/monitor-lg-ultragear-24g411a-b-24fhd-144hz-1ms-mbr-nvidia-g-sync-amd-freesync-hdr10/p/MLB57489948?wid=MLB4452425949",
        accessedAt: "2026-09-24",
      },
    ],
    updatedAt: "2026-09-24",
  },
  {
    id: "kit-teclado-mouse-goodvision",
    name: "Kit gamer Goodvision com teclado e mouse RGB",
    slug: "kit-teclado-mouse-goodvision-rgb",
    category: "Teclado",
    subcategory: "Kit teclado e mouse",
    brand: "Goodvision (conforme o anúncio)",
    summary: "Um kit para começar a montar o setup com teclado e mouse em uma compra. O anúncio informa iluminação RGB e conexão USB; confira o layout, os recursos e os itens inclusos antes de escolher.",
    forWho: "Quem quer equipar uma mesa de entrada com teclado e mouse juntos e prefere conferir a oferta atual direto na loja.",
    notFor: "Quem precisa escolher teclado e mouse por especificações detalhadas, como tipo de switch, sensor ou medidas já verificadas.",
    specs: [
      { label: "Itens anunciados", value: "Teclado e mouse" },
      { label: "Conexão anunciada", value: "USB com fio" },
      { label: "Iluminação anunciada", value: "RGB" },
      { label: "Marca informada no anúncio", value: "Goodvision" },
      { label: "Layout e recursos", value: "Confirmar na página da loja" },
    ],
    useCases: ["Gaming", "Uso geral"],
    profile: "Econômico",
    tags: ["kit teclado mouse", "rgb", "usb", "entrada"],
    offers: [
      {
        store: "Mercado Livre",
        availability: "Sob consulta",
        affiliateUrl: "https://meli.la/1BP6m8N",
        updatedAt: "2026-09-24",
      },
    ],
    status: "illustrative",
    sources: [
      {
        label: "Mercado Livre — anúncio do kit Goodvision de teclado e mouse",
        url: "https://www.mercadolivre.com.br/kit-teclado-mouse-gamer-completo-barato-com-fio-cabo-de-15m-led-com-iluminacao-rgb-desktop-conexao-usb-cor-preto-usar-com-headset-acessorios-pc-mecanico-jogos-goodvision/p/MLB51383856?item_id=MLB4464700619",
        accessedAt: "2026-09-24",
      },
    ],
    updatedAt: "2026-09-24",
  },
  {
    id: "mouse-wireless-59",
    name: "Mouse wireless leve para FPS",
    slug: "mouse-wireless-leve-fps",
    category: "Mouse",
    brand: "Curadoria aberta",
    summary: "Prioriza peso, sensores e mobilidade para movimentos rápidos.",
    forWho: "Quem joga FPS e valoriza controle, liberdade de movimento e pouco peso.",
    notFor: "Quem prefere mouse com muitos botões, ergonomia ampla ou funções de escritório.",
    specs: [
      { label: "Conexão", value: "Wireless" },
      { label: "Perfil", value: "Competitivo" },
      { label: "Peso", value: "Confirmar na oferta" },
    ],
    useCases: ["Gaming", "Uso geral"],
    profile: "Desempenho",
    tags: ["fps", "wireless", "leve"],
    offers: [],
    status: "illustrative",
    updatedAt: "2026-09-21",
  },
  {
    id: "teclado-redragon-fizz",
    name: "Redragon Fizz Rainbow 60% — switch Brown",
    slug: "teclado-redragon-fizz-60",
    category: "Teclado",
    brand: "Redragon",
    summary: "Teclado mecânico compacto com switch Brown, formato 60% e hot-swap. Confirme a variante no anúncio.",
    forWho: "Quem prefere um teclado compacto e quer liberar espaço na mesa para o mouse.",
    notFor: "Quem precisa de teclado numérico dedicado ou prefere um formato maior, como 65% ou TKL.",
    specs: [
      { label: "Formato", value: "60%" },
      { label: "Acionamento", value: "Mecânico" },
      { label: "Switch do anúncio", value: "Brown (marrom)" },
      { label: "Troca de switches", value: "Hot-swap" },
      { label: "Layout", value: "ABNT2" },
    ],
    useCases: ["Gaming", "Programação", "Trabalho"],
    profile: "Equilibrado",
    tags: ["mecânico", "60%", "hot-swap", "switch brown"],
    offers: [
      {
        store: "Mercado Livre",
        availability: "Sob consulta",
        affiliateUrl: "https://meli.la/2N46ZkQ",
        updatedAt: "2026-09-24",
      },
    ],
    status: "illustrative",
    sources: [
      {
        label: "Redragon Brasil — Fizz Rainbow (formato 60%, hot-swap e layout ABNT2)",
        url: "https://novo.redragon.com.br/produto/fizz-rainbow",
        accessedAt: "2026-09-24",
      },
      {
        label: "Mercado Livre — anúncio Redragon Fizz Rainbow, switch Brown",
        url: "https://www.mercadolivre.com.br/teclado-redragon-gamer-fizz-rainbow-switch-brown-mecanico-cor-de-teclado-preto-idioma-portugues-brasil/p/MLB22313189?wid=MLB5687307630",
        accessedAt: "2026-09-24",
      },
    ],
    updatedAt: "2026-09-24",
  },
  {
    id: "headset-anc",
    name: "Headset com cancelamento de ruído",
    slug: "headset-cancelamento-ruido",
    category: "Headset",
    brand: "Curadoria aberta",
    summary: "Opção para sessões longas e ambientes compartilhados, com conforto como prioridade.",
    forWho: "Quem prioriza a melhor qualidade de microfone para lives, chamadas e transmissões.",
    notFor: "Quem prefere um headset aberto para manter consciência total do ambiente ao redor.",
    specs: [
      { label: "Recurso principal", value: "Cancelamento de ruído" },
      { label: "Conexão", value: "Verificar oferta" },
      { label: "Uso", value: "Gaming e chamadas" },
    ],
    useCases: ["Gaming", "Trabalho", "Streaming"],
    profile: "Equilibrado",
    tags: ["longas sessões", "foco", "comunicação"],
    offers: [],
    status: "illustrative",
    updatedAt: "2026-09-21",
  },
  {
    id: "mousepad-desk",
    name: "Mousepad XL para mesa compacta",
    slug: "mousepad-xl-mesa-compacta",
    category: "Mousepad",
    brand: "Curadoria aberta",
    summary: "Mais área para movimentos contínuos do mouse e composição visual limpa.",
    forWho: "Quem usa teclado e mouse lado a lado e quer uma superfície contínua.",
    notFor: "Quem precisa liberar a mesa para teclado e mouse em posições muito afastadas.",
    specs: [
      { label: "Formato", value: "XL" },
      { label: "Uso", value: "Jogo e desk setup" },
      { label: "Mesa", value: "Compatível com setups compactos" },
    ],
    useCases: ["Gaming", "Uso geral"],
    profile: "Econômico",
    tags: ["organização", "mesa", "minimalista"],
    offers: [],
    status: "illustrative",
    updatedAt: "2026-09-21",
  },
] as const;

/** Fonte única para listar as fichas que atualmente têm links afiliados. */
export const affiliateProducts: readonly Product[] = products.filter((product) =>
  product.offers.some((offer) => offer.store === "Mercado Livre" && isMercadoLivreUrl(offer.affiliateUrl)),
);

/** Um produto só pode aparecer como item de compra se tiver saída válida para o Mercado Livre. */
export function isMercadoLivreUrl(value?: string): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && !url.username
      && !url.password
      && !url.port
      && (url.hostname.toLowerCase() === "meli.la"
        || url.hostname.toLowerCase() === "mercadolivre.com.br"
        || url.hostname.toLowerCase().endsWith(".mercadolivre.com.br"));
  } catch {
    return false;
  }
}

export function hasMercadoLivreOffer(product: Product | undefined): product is Product {
  return Boolean(product?.offers.some((offer) => offer.store === "Mercado Livre"
    && (isMercadoLivreUrl(offer.affiliateUrl) || isMercadoLivreUrl(offer.productUrl))));
}

export const productsWithMercadoLivreLinks: readonly Product[] = products.filter(hasMercadoLivreOffer);

export const setups: readonly Setup[] = [
  {
    slug: "setup-fps-1080p",
    name: "Setup FPS 1080p",
    profile: "Performance competitiva",
    focus: ["Alto FPS", "Baixa latência", "Mesa compacta"],
    budget: "Orçamento intermediário",
    description: "Uma combinação ordenada para colocar desempenho e responsividade antes de efeitos visuais.",
    productIds: ["ryzen-5-5600", "monitor-24-144", "monitor-gamer-24-100", "mouse-wireless-59", "headset-anc", "mousepad-desk"],
    searchTerms: ["jogos", "fps", "gamer", "jogar"],
  },
  {
    slug: "setup-dev-hibrido",
    name: "Setup Dev híbrido",
    profile: "Programação + gaming",
    focus: ["Multitarefa", "Teclado compacto", "Conforto"],
    budget: "Investimento progressivo",
    description: "Componentes pensados para alternar entre código, chamadas e sessões de jogo com menos ruído visual.",
    productIds: ["teclado-redragon-fizz", "monitor-24-144", "monitor-gamer-24-100", "mouse-wireless-59", "headset-anc"],
    searchTerms: ["programação", "programar", "desenvolvimento", "home office", "montar setup", "trabalho e jogos", "trabalho e jogar", "trabalhar e jogar", "programador"],
  },
  {
    slug: "setup-minimalista",
    name: "Setup minimalista",
    profile: "Design e organização",
    focus: ["Mesa limpa", "Poucos elementos", "Visual discreto"],
    budget: "Por componentes",
    description: "Uma seleção enxuta para quem quer que o setup organize o ambiente sem competir com o trabalho.",
    productIds: ["teclado-redragon-fizz", "monitor-24-144", "mouse-wireless-59", "mousepad-desk"],
    searchTerms: ["mesa organizada", "minimalista", "organização"],
  },
] as const;

export const guides: readonly Guide[] = [
  {
    slug: "pc-lento-o-que-verificar",
    title: "PC lento: o que verificar antes de comprar peças",
    description: "Um roteiro curto para separar lentidão de inicialização, falta de espaço e uso alto de CPU, memória ou disco antes de gastar com um upgrade.",
    eyebrow: "Resolver um problema",
    sections: [
      { title: "Descubra quando a lentidão acontece", content: "Anote se o computador demora para iniciar, fica lento só com um programa específico ou perde velocidade depois de algum tempo ligado. Esses sinais apontam causas diferentes e ajudam a evitar uma compra que não resolve o problema." },
      { title: "Observe o que está sendo usado", content: "No Windows, abra o Gerenciador de Tarefas com Ctrl + Shift + Esc. Em Processos e Desempenho, observe CPU, memória e disco durante a lentidão. Procure uso alto que se mantém por alguns minutos e confira quais aplicativos aparecem no topo; um pico rápido, sozinho, não prova que uma peça precisa ser trocada." },
      { title: "Tente os ajustes sem custo primeiro", content: "Confira os aplicativos que iniciam junto com o Windows, feche programas que não está usando, verifique se há espaço livre e instale atualizações pendentes. Se suspeitar de software malicioso, faça uma verificação com a Segurança do Windows. Reinicie e repita a observação para ver se algo mudou." },
      { title: "Só então avalie um upgrade", content: "Se o problema persistir, compare o gargalo observado com a tarefa que você quer melhorar. Um SSD só faz sentido como prioridade se o computador ainda usa HD e a demora de inicialização ou acesso ao disco for relevante; mais memória pode ajudar quando o uso habitual se aproxima do limite. Antes de comprar, confirme compatibilidade, faça backup e peça ajuda técnica se não souber identificar as peças." },
      { title: "Quando não comprar ainda", content: "Se CPU, memória e disco não ficam sob pressão durante o problema, ou se a lentidão começou após uma mudança de software, investigue atualizações, aplicativos e suporte técnico antes de trocar componentes. O catálogo atual ainda não tem SSD ou memória com modelo e compatibilidade verificados para recomendar." },
    ],
    productIds: [],
    updatedAt: "2026-09-24",
    index: true,
    searchTerms: ["pc lento", "computador lento", "máquina lenta", "upgrade", "ssd", "ram", "memória", "deixar computador mais rápido", "lentidão"],
    sources: [
      {
        label: "Microsoft Support — dicas para melhorar o desempenho do PC no Windows",
        url: "https://support.microsoft.com/en-us/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows",
        accessedAt: "2026-09-24",
      },
      {
        label: "Microsoft Support — configurar aplicativos de inicialização no Windows",
        url: "https://support.microsoft.com/en-us/windows/experience/startup-boot/configure-startup-applications-in-windows",
        accessedAt: "2026-09-24",
      },
    ],
  },
  {
    slug: "como-escolher-um-pc-gamer",
    title: "Como escolher um PC gamer sem comprar peças pela moda",
    description: "Um método para começar pelo uso, definir a resolução e escolher cada componente com um objetivo claro.",
    eyebrow: "Guia de compra",
    sections: [
      { title: "Comece pela experiência", content: "Antes da peça, defina a resolução, os jogos e a frequência que realmente importam para você. Uma configuração de 1080p é válida; uma configuração de 4K é outra decisão, com outro orçamento." },
      { title: "Equilibre o conjunto", content: "CPU, GPU, memória, fonte e armazenamento precisam fazer sentido juntos. O componente mais chamativo não deve criar um gargalo invisível no restante do sistema." },
      { title: "Considere a manutenção", content: "Verifique compatibilidade de placa-mãe, altura do cooler, espaço do gabinete, conectores e uma fonte com margem para upgrades futuros." },
    ],
    productIds: ["ryzen-5-5600", "monitor-24-144"],
    updatedAt: "2026-09-21",
  },
  {
    slug: "monitor-para-gaming",
    title: "Qual monitor escolher para gaming em 2026",
    description: "Resolução, taxa de atualização e tipo de painel: o que realmente altera sua escolha.",
    eyebrow: "Guia de compra",
    sections: [
      { title: "Resolução antes da estética", content: "1080p é uma base eficiente para alta taxa de quadros; 1440p oferece mais espaço e exige mais da GPU. A escolha deve começar pelo jogo e pela distância da tela." },
      { title: "Hz não é tudo", content: "Latência, resposta, estabilidade e qualidade da imagem importam tanto quanto a frequência anunciada. Compare análises e especificações do fabricante." },
      { title: "Encaixe na sua mesa", content: "Verifique profundidade, ergonomia, ajuste de altura e espaço para o suporte. Um monitor excelente no papel pode ser ruim se não funciona bem na sua rotina." },
    ],
    productIds: ["monitor-24-144"],
    updatedAt: "2026-09-21",
  },
  {
    slug: "perifericos-para-fps",
    title: "Periféricos para FPS: o que merece atenção",
    description: "Mouse, teclado, headset e monitor funcionando juntos são mais importantes do que uma lista de recursos.",
    eyebrow: "Curadoria",
    sections: [
      { title: "Comece pelo controle", content: "Peso, ergonomia, conexão e leitura do sensor ajudam a definir o tipo de mouse que combina com seu estilo de movimento. Não existe uma resposta universal." },
      { title: "Coerência acima de quantidade", content: "Um conjunto compacto e consistente pode melhorar a mesa e a concentração. Teclas extras só são úteis quando têm função na sua rotina." },
    ],
    productIds: ["mouse-wireless-59", "teclado-redragon-fizz", "monitor-24-144", "headset-anc"],
    updatedAt: "2026-09-21",
  },
] as const;

export const games: readonly Game[] = [
  {
    slug: "valorant",
    name: "Valorant",
    genre: "FPS competitivo",
    description: "Para competitividade, priorize o monitor, o controle responsivo e uma configuração estável em alta frequência.",
    minimum: "Resolução 1080p · configuração competitiva",
    recommended: "Resolução 1080p · alta taxa de quadros",
    targets: [
      { label: "Resolução", detail: "1080p como ponto de partida competitivo" },
      { label: "Input", detail: "Mouse confortável e monitor de 144 Hz" },
      { label: "Conforto", detail: "Headset com isolamento e peso bem distribuído" },
    ],
    productIds: ["monitor-24-144", "mouse-wireless-59", "headset-anc", "teclado-redragon-fizz"],
    updatedAt: "2026-09-21",
  },
  {
    slug: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    genre: "RPG em primeira pessoa",
    description: "Uma referência para quem busca qualidade visual e quer entender o impacto de ray tracing e resolução.",
    minimum: "Resolução 1080p · qualidade balanceada",
    recommended: "Resolução 1440p · qualidade alta",
    targets: [
      { label: "Resolução", detail: "1440p oferece uma imagem mais estável para o cenário" },
      { label: "GPU", detail: "Priorize desempenho e VRAM da placa de vídeo" },
      { label: "Imagem", detail: "Ray tracing depende mais do orçamento disponível" },
    ],
    productIds: ["monitor-24-144", "ryzen-5-5600", "headset-anc"],
    updatedAt: "2026-09-21",
  },
] as const;

export const categories: readonly ProductCategory[] = [
  "PC", "Monitor", "Teclado", "Mouse", "Headset", "Mousepad", "Webcam", "Microfone", "Iluminação", "Cadeira", "Acessórios",
];

export function getProduct(slug: string) { return productsWithMercadoLivreLinks.find((product) => product.slug === slug); }
export function getSetup(slug: string) { return setups.find((setup) => setup.slug === slug); }
export function getGuide(slug: string) { return guides.find((guide) => guide.slug === slug); }
export function getGame(slug: string) { return games.find((game) => game.slug === slug); }
export function productById(id: string) { return productsWithMercadoLivreLinks.find((product) => product.id === id); }
export function isSafeExternalUrl(value?: string): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
export function setupPath(slug: string) { return `/setup/setups/${slug}`; }
export function guidePath(slug: string) { return `/setup/guias/${slug}`; }
export function gamePath(slug: string) { return `/setup/jogos/${slug}`; }
export function productPath(slug: string) { return `/setup/produtos/${slug}`; }
