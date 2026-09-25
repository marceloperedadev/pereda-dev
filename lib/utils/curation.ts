const labels: Record<string, string> = {
  gaming: "Jogos",
  games: "Jogos",
  programacao: "Programação",
  "home-office": "Home office",
  design: "Design",
  edicao: "Edição",
  "uso-geral": "Uso geral",
  trabalho: "Trabalho",
  "upgrade-pc-lento": "PC lento",
  "upgrade-armazenamento": "Mais armazenamento",
  "upgrade-memoria": "Mais memória",
  "upgrade-games": "Desempenho em jogos",
  monitores: "Monitores",
  teclados: "Teclados",
  mouses: "Mouses",
  headsets: "Headsets",
  webcams: "Webcams",
  microfones: "Microfones",
};

export function formatCurationContext(value: string) {
  return labels[value] ?? value.replace(/-/g, " ").replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("pt-BR"));
}
