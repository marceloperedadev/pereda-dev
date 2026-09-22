# pereda.dev — Portfólio de Marcelo Felipe

Portfólio autoral de desenvolvedor Full Stack (Next.js App Router · TypeScript · CSS Modules).
Foco: clientes locais — sites, lojas virtuais e sistemas. SEO técnico e GA4 estruturados desde a arquitetura.

## Rodar

```bash
npm install
cp .env.example .env.local   # preencha o que tiver
npm run dev                  # http://localhost:3000
npm run typecheck
npm run build && npm start
```

## Variáveis de ambiente

```env
NEXT_PUBLIC_SITE_URL=https://pereda.dev
NEXT_PUBLIC_GA_ID=
GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_LINKEDIN_URL=
NEXT_PUBLIC_GITHUB_URL=
```

Na Vercel: Project → Settings → Environment Variables (marque Production).

## O que você precisa revisar antes de publicar

1. **`lib/data/projects.ts`** — os textos dos 4 projetos foram escritos a partir do nome/categoria.
   Confirme e ajuste `execution`, `features`, `decisions` e `stack`. Prospector é o mais genérico.
   Se algum projeto tiver URL no ar, preencha `url`.
2. **Prints reais** — veja `public/projects/README.md`.
3. **`lib/content/home.ts`** — seção "Sobre" foi escrita sem inventar experiência (você disse que ainda não atua na área). Ajuste o tom se quiser.
4. **Foto** — coloque em `/public` e preencha `photo` em `lib/config/site.ts`. Sem foto, aparece um monograma "MF".
5. **LinkedIn / GitHub** — só aparecem quando as variáveis estiverem preenchidas.
6. **Ícones PNG** (192/512 e apple-touch-icon) — hoje só há `app/icon.svg`.

## Ativar GA4

1. Crie a propriedade em analytics.google.com → fluxo de dados Web → copie o ID `G-XXXXXXXXXX`.
2. Defina `NEXT_PUBLIC_GA_ID`. Faça novo deploy.
3. Ao entrar no site aparece um aviso discreto; o GA **só carrega após "Aceitar"** (LGPD). Sem ID, nada carrega e o aviso não aparece.
4. Valide em GA4 → Relatórios → Tempo real. Marque `click_whatsapp` e `submit_contact` como **eventos-chave** (conversões).

Eventos implementados: `page_view`, `view_project`, `click_project`, `project_view`, `project_cta_click`,
`click_whatsapp`, `click_email`, `click_linkedin`, `click_github`, `start_contact`, `submit_contact`,
`scroll_50`, `scroll_75`, `scroll_90`. Parâmetros: `project_name`, `project_category`, `project_position`,
`cta_location`, `cta_name`, `interaction`, `project_type`.
Código em `lib/analytics/` (config, consent, events) e `components/analytics/`.

Funil: page_view → view_project → click_project / project_view → start_contact → click_whatsapp / submit_contact.

## Ativar Google Search Console

1. search.google.com/search-console → Adicionar propriedade → **Prefixo do URL** `https://pereda.dev`.
2. Método "Tag HTML": copie **apenas** o valor de `content`.
3. Defina `GOOGLE_SITE_VERIFICATION` e faça deploy; clique em Verificar.
4. Envie `https://pereda.dev/sitemap.xml` em Sitemaps.

(Alternativa: verificação por DNS, sem código.)

## SEO implementado

title/description/canonical/robots por página · Open Graph e Twitter Cards · imagens OG dinâmicas (home e cada projeto) ·
`sitemap.xml` e `robots.txt` nativos · JSON-LD (WebSite, Person, ProfilePage, CreativeWork, BreadcrumbList, ContactPage, CollectionPage) ·
URLs limpas `/projetos/[slug]` estáticas (SSG) · H1 único por página · links internos cruzados · `next/image` com alt descritivo · manifest.

## Estrutura

```
app/                 rotas, metadata, sitemap, robots, manifest, OG
components/layout/   Header, Footer
components/sections/ Hero, Proof, Projects(+Carousel), Process, Stack, Differential, About, Contact
components/ui/       ButtonLink, TrackedLink, Reveal, ProjectCover, ContactForm, JsonLd…
components/analytics/ Analytics (GA4 + consentimento), ScrollDepth, ProjectViewTracker
lib/config/          site.ts (nome, contato, URLs)
lib/data/            projects.ts (fonte única dos projetos)
lib/content/         home.ts (textos)
lib/analytics/       config, consent, events
lib/seo/             metadata, jsonld
```

## Checklist pós-deploy

- [ ] `/sitemap.xml` e `/robots.txt` abrem
- [ ] Testar compartilhamento no WhatsApp/LinkedIn (cache: developers.facebook.com/tools/debug)
- [ ] Rich Results Test nas páginas `/` e `/projetos/belo-cao`
- [ ] Lighthouse mobile na home e em um case
- [ ] Testar o carrossel no celular real (arrastar, rolagem vertical)
- [ ] GA4 Tempo real recebendo eventos após aceitar o aviso
