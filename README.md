# marcelopereda.dev â€” PortfÃ³lio de Marcelo Felipe

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
NEXT_PUBLIC_SITE_URL=https://marcelopereda.dev
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

1. search.google.com/search-console â†’ Adicionar propriedade â†’ **Prefixo do URL** `https://marcelopereda.dev`.
2. MÃ©todo "Tag HTML": copie **apenas** o valor de `content`.
3. Defina `GOOGLE_SITE_VERIFICATION` e faÃ§a deploy; clique em Verificar.
4. Envie `https://marcelopereda.dev/sitemap.xml` em Sitemaps.

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

## Preparar integraÃ§Ãµes de afiliados

As variÃ¡veis de API ficam em `.env.local` no computador (copie de `.env.example`) ou nas Environment Variables do servidor. Nunca use prefixo `NEXT_PUBLIC_` em segredos. O arquivo `.env.local` jÃ¡ estÃ¡ ignorado pelo Git.

Os nomes em `.env.example` sÃ£o espaÃ§os reservados para credenciais emitidas pelos prÃ³prios programas; preenchÃª-los nÃ£o inicia consultas de preÃ§o. Cada integraÃ§Ã£o sÃ³ poderÃ¡ ser ligada quando houver acesso aprovado e documentaÃ§Ã£o oficial com autenticaÃ§Ã£o, endpoints, limites e regras de uso. KaBuM/Awin e Terabyte podem oferecer apenas links de parceiro, sem API de preÃ§o.

`lib/server/affiliate-env.ts` lÃª essas variÃ¡veis exclusivamente em cÃ³digo de servidor e retorna `undefined` quando faltam credenciais. NÃ£o importe esse mÃ³dulo em componentes cliente nem envie o retorno ao navegador. O adaptador de busca/detalhe do Mercado Livre estÃ¡ implementado; Amazon, KaBuM! e Terabyte continuam desligados atÃ© haver API oficial e credenciais apropriadas.

Para o Mercado Livre, o inÃ­cio OAuth estÃ¡ em `/api/afiliados/mercadolivre/connect` e o retorno em `/api/afiliados/mercadolivre/callback`. Antes de usar, cadastre a URI exata do callback nas configuraÃ§Ãµes do app, configure o projeto Supabase com a migraÃ§Ã£o `supabase/migrations/202609240001_affiliate_oauth_tokens.sql` e preencha `SUPABASE_URL` e `SUPABASE_SECRET_KEY` apenas no servidor. Tokens de acesso e refresh sÃ£o rotacionados e ficam nessa tabela privada; nÃ£o devem ser postos manualmente no `.env.local`.

## Curadoria conectada ao Mercado Livre

A Ã¡rea pÃºblica fica em `/setup/curadoria` e sÃ³ consulta produtos com estado `published`, anÃºncio ativo e verificaÃ§Ã£o feita nas Ãºltimas 48 horas. A pÃ¡gina `/setup` mantÃ©m a entrada por problema/necessidade; a curadoria aparece como continuaÃ§Ã£o, nÃ£o como catÃ¡logo principal.

### Banco e segredos

1. Aplique no Supabase, nesta ordem, `supabase/migrations/202609240001_affiliate_oauth_tokens.sql`, `supabase/migrations/202609250001_setup_curation.sql` e `supabase/migrations/202609250002_mercadolivre_refresh_coordination.sql`. A migration da curadoria coloca os quatro anúncios de afiliado atuais em `discovered`; nenhum é aprovado ou publicado automaticamente. A última adiciona a coordenação distribuída necessária para a rotação segura dos refresh tokens.
2. Mantenha `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `MERCADOLIVRE_CLIENT_ID`, `MERCADOLIVRE_CLIENT_SECRET`, `MERCADOLIVRE_REDIRECT_URI`, `MERCADOLIVRE_CONNECT_USERNAME` e `MERCADOLIVRE_CONNECT_PASSWORD` somente no servidor.
3. Configure `CRON_SECRET` como segredo aleatÃ³rio com pelo menos 16 caracteres no ambiente local e na Vercel.
4. Cadastre no app do Mercado Livre exatamente `https://www.peredadev.com.br/api/afiliados/mercadolivre/callback` como URI de retorno OAuth.

O callback e a rota de busca compartilham o acesso Basic Auth configurado pelas variÃ¡veis `MERCADOLIVRE_CONNECT_USERNAME` e `MERCADOLIVRE_CONNECT_PASSWORD`. A chave secreta do Supabase nunca Ã© usada no navegador.

### Descobrir, revisar e publicar

Todas as rotas `/api/admin/curadoria/*` exigem o Basic Auth acima.

- Buscar: `GET /api/admin/curadoria/mercadolivre/search?q=ssd%20nvme` (atÃ© 10 resultados).
- Importar para `discovered`: `POST /api/admin/curadoria/mercadolivre/import` com JSON `{"itemId":"MLB1234567890","contexts":["upgrade-pc-lento"]}`.
- Ver fila: `GET /api/admin/curadoria/produtos?status=discovered`.
- Atualizar a ficha: `PATCH /api/admin/curadoria/produtos` com `id`, `status`, `slug`, `editorialTitle`, `suitableFor`, `recommendationReason`, `limitations`, `contexts` e, quando existir, `affiliateUrl`.

Use os estados nesta ordem: `discovered` (importado), `review` (em anÃ¡lise), `approved` (editorialmente aprovado) e `published` (visÃ­vel ao pÃºblico). A API exige a transiÃ§Ã£o por cada etapa. Publicar exige uma consulta recente, anÃºncio ativo, preÃ§o, contexto, slug, pÃºblico, justificativa e limitaÃ§Ãµes preenchidas. `affiliateUrl` Ã© opcional e deve ser um link que vocÃª jÃ¡ gerou e verificou; nenhuma API de afiliados Ã© presumida ou inventada. O link de origem retornado pela API e a saÃ­da afiliada ficam em campos diferentes.

`GET /api/cron/curadoria/mercadolivre` tenta atualizar atÃ© 4 fichas por execuÃ§Ã£o e deixa as restantes para a prÃ³xima chamada se o tempo seguro da funÃ§Ã£o estiver acabando. Cada consulta externa e operaÃ§Ã£o no Supabase tem timeout; a rota reserva margem dentro do limite de 60 segundos da funÃ§Ã£o. A Vercel chama essa rota uma vez ao dia conforme `vercel.json`; a chamada exige `Authorization: Bearer $CRON_SECRET`. RepetiÃ§Ãµes nÃ£o duplicam histÃ³rico para o mesmo preÃ§o. AnÃºncios indisponÃ­veis sÃ£o expirados, removidos da pÃ¡gina e tÃªm o histÃ³rico externo apagado. A API nÃ£o informa necessariamente a quantidade em estoque para um token que nÃ£o Ã© do vendedor, portanto a interface nÃ£o afirma estoque confirmado.

O histÃ³rico guarda apenas a primeira consulta e alteraÃ§Ãµes reais de preÃ§o; nÃ£o gera afirmaÃ§Ãµes de menor preÃ§o ou desconto. A consulta automÃ¡tica diÃ¡ria usa Cron da Vercel Hobby, dentro do limite de uma execuÃ§Ã£o diÃ¡ria. A Vercel pode iniciar em qualquer minuto dentro da hora agendada.

## Painel administrativo de analytics

Acesse `/admin/analytics` e entre com a senha definida em `ANALYTICS_ADMIN_SECRET`. O painel usa um cookie HttpOnly com validade de 24 horas; a senha não é armazenada no navegador. Configure também `SUPABASE_URL` e `SUPABASE_SECRET_KEY` no servidor e aplique `supabase/migrations/202609300001_analytics.sql` para habilitar os dados. O painel mostra visitantes, sessões, páginas, conversões, eventos e contatos nos últimos 7, 30 ou 90 dias.

## Analytics próprio e acesso ao painel

O tracker grava em Supabase apenas depois do consentimento armazenado no navegador. `NEXT_PUBLIC_GA_ID` habilita o banner de escolha e os envios ao GA4 e ao coletor próprio; a coleta Supabase usa `/api/analytics/collect` e não bloqueia a navegação. Somente eventos conhecidos e propriedades permitidas são aceitos. Busca bruta, respostas do guia e campos do briefing não são gravados. O briefing reportado no painel é a contagem do evento `submit_contact`, não um lead nem o conteúdo enviado.

Para habilitar `/admin/analytics`, defina `ANALYTICS_ADMIN_SECRET`, `SUPABASE_URL` e `SUPABASE_SECRET_KEY` no servidor e aplique `supabase/migrations/202609300001_analytics.sql`. A chave Supabase é usada somente em código servidor. Acesse a rota e autentique com o segredo administrativo; a sessão dura 24 horas.

## Administração de projetos e estudos de caso

Acesse `/admin/projetos` e use a senha definida em `ANALYTICS_ADMIN_SECRET` (a sessão é compartilhada com o painel de analytics). A migration `supabase/migrations/202609300002_portfolio_projects_admin.sql` cria as tabelas privadas de projetos e revisões; configure `SUPABASE_URL` e `SUPABASE_SECRET_KEY` no servidor antes de salvar. Aplique migrations ao seu ambiente local com o fluxo padrão do Supabase CLI; nenhuma migration é aplicada remotamente por esta funcionalidade.

A análise por URL aceita apenas páginas HTTPS públicas e extrai metadados HTML básicos. Endereços internos, IPs privados, redirecionamentos não revalidados, conteúdo fora de HTML, páginas acima de 1 MB e consultas acima de 7 segundos são bloqueados. A análise não confirma tecnologias, código, integrações, funcionalidades internas, objetivos do cliente ou resultados comerciais. Esses campos precisam de revisão e confirmação humana. A aplicação não envia conteúdo a serviços de IA e não usa chave de IA.

Projetos novos começam em rascunho ou aguardando informações. Edite a proposta, resolva as pendências e use “Publicar após revisão” para publicar. Projetos arquivados deixam de aparecer no portfólio. Alterações salvas mantêm revisões anteriores na tabela de histórico. A importação não baixa nem copia imagens externas; use somente arquivos autorizados que já estejam em `public/`. Upload de imagens ainda não está disponível. Cases antigos continuam no catálogo TypeScript até serem editados e publicados no admin.
