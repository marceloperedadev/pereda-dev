# pereda.dev â€” PortfÃ³lio de Marcelo Felipe

PortfÃ³lio autoral de desenvolvedor Full Stack (Next.js App Router Â· TypeScript Â· CSS Modules).
Foco: clientes locais â€” sites, lojas virtuais e sistemas. SEO tÃ©cnico e GA4 estruturados desde a arquitetura.

## Rodar

```bash
npm install
cp .env.example .env.local   # preencha o que tiver
npm run dev                  # http://localhost:3000
npm run typecheck
npm run build && npm start
```

## VariÃ¡veis de ambiente

```env
NEXT_PUBLIC_SITE_URL=https://pereda.dev
NEXT_PUBLIC_GA_ID=
GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_LINKEDIN_URL=
NEXT_PUBLIC_GITHUB_URL=
```

Na Vercel: Project â†’ Settings â†’ Environment Variables (marque Production).

## O que vocÃª precisa revisar antes de publicar

1. **`lib/data/projects.ts`** â€” os textos dos 4 projetos foram escritos a partir do nome/categoria.
   Confirme e ajuste `execution`, `features`, `decisions` e `stack`. Prospector Ã© o mais genÃ©rico.
   Se algum projeto tiver URL no ar, preencha `url`.
2. **Prints reais** â€” veja `public/projects/README.md`.
3. **`lib/content/home.ts`** â€” seÃ§Ã£o "Sobre" foi escrita sem inventar experiÃªncia (vocÃª disse que ainda nÃ£o atua na Ã¡rea). Ajuste o tom se quiser.
4. **Foto** â€” coloque em `/public` e preencha `photo` em `lib/config/site.ts`. Sem foto, aparece um monograma "MF".
5. **LinkedIn / GitHub** â€” sÃ³ aparecem quando as variÃ¡veis estiverem preenchidas.
6. **Ãcones PNG** (192/512 e apple-touch-icon) â€” hoje sÃ³ hÃ¡ `app/icon.svg`.

## Ativar GA4

1. Crie a propriedade em analytics.google.com â†’ fluxo de dados Web â†’ copie o ID `G-XXXXXXXXXX`.
2. Defina `NEXT_PUBLIC_GA_ID`. FaÃ§a novo deploy.
3. Ao entrar no site aparece um aviso discreto; o GA **sÃ³ carrega apÃ³s "Aceitar"** (LGPD). Sem ID, nada carrega e o aviso nÃ£o aparece.
4. Valide em GA4 â†’ RelatÃ³rios â†’ Tempo real. Marque `click_whatsapp` e `submit_contact` como **eventos-chave** (conversÃµes).

Eventos implementados: `page_view`, `view_project`, `click_project`, `project_view`, `project_cta_click`,
`click_whatsapp`, `click_email`, `click_linkedin`, `click_github`, `start_contact`, `submit_contact`,
`scroll_50`, `scroll_75`, `scroll_90`. ParÃ¢metros: `project_name`, `project_category`, `project_position`,
`cta_location`, `cta_name`, `interaction`, `project_type`.
CÃ³digo em `lib/analytics/` (config, consent, events) e `components/analytics/`.

Funil: page_view â†’ view_project â†’ click_project / project_view â†’ start_contact â†’ click_whatsapp / submit_contact.

## Ativar Google Search Console

1. search.google.com/search-console â†’ Adicionar propriedade â†’ **Prefixo do URL** `https://pereda.dev`.
2. MÃ©todo "Tag HTML": copie **apenas** o valor de `content`.
3. Defina `GOOGLE_SITE_VERIFICATION` e faÃ§a deploy; clique em Verificar.
4. Envie `https://pereda.dev/sitemap.xml` em Sitemaps.

(Alternativa: verificaÃ§Ã£o por DNS, sem cÃ³digo.)

## SEO implementado

title/description/canonical/robots por pÃ¡gina Â· Open Graph e Twitter Cards Â· imagens OG dinÃ¢micas (home e cada projeto) Â·
`sitemap.xml` e `robots.txt` nativos Â· JSON-LD (WebSite, Person, ProfilePage, CreativeWork, BreadcrumbList, ContactPage, CollectionPage) Â·
URLs limpas `/projetos/[slug]` estÃ¡ticas (SSG) Â· H1 Ãºnico por pÃ¡gina Â· links internos cruzados Â· `next/image` com alt descritivo Â· manifest.

## Estrutura

```
app/                 rotas, metadata, sitemap, robots, manifest, OG
components/layout/   Header, Footer
components/sections/ Hero, Proof, Projects(+Carousel), Process, Stack, Differential, About, Contact
components/ui/       ButtonLink, TrackedLink, Reveal, ProjectCover, ContactForm, JsonLdâ€¦
components/analytics/ Analytics (GA4 + consentimento), ScrollDepth, ProjectViewTracker
lib/config/          site.ts (nome, contato, URLs)
lib/data/            projects.ts (fonte Ãºnica dos projetos)
lib/content/         home.ts (textos)
lib/analytics/       config, consent, events
lib/seo/             metadata, jsonld
```

## Checklist pÃ³s-deploy

- [ ] `/sitemap.xml` e `/robots.txt` abrem
- [ ] Testar compartilhamento no WhatsApp/LinkedIn (cache: developers.facebook.com/tools/debug)
- [ ] Rich Results Test nas pÃ¡ginas `/` e `/projetos/mimo-pet`
- [ ] Lighthouse mobile na home e em um case
- [ ] Testar o carrossel no celular real (arrastar, rolagem vertical)
- [ ] GA4 Tempo real recebendo eventos apÃ³s aceitar o aviso

