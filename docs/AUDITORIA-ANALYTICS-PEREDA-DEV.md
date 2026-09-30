# Auditoria de analytics — Pereda Dev

Data da auditoria: 2026-09-30

## Escopo e resultado

Auditoria estatica de `/admin/analytics`, autenticaçao, APIs, consultas, tracker/eventos, consentimento, migration, variaveis, README e admin de curadoria. A migration e o codigo foram lidos; nao houve acesso ao projeto Supabase, deploy da Vercel ou credenciais de produçao. O estado real desses servicos e **NAO VERIFICADO**.

O painel e a autenticaçao ja existiam. A auditoria encontrou que o tracker enviava eventos somente ao GA4, apesar de existirem consultas e tabelas Supabase. Tambem encontrou proteçao de interface somente no cliente, erros REST convertidos em resultados vazios e contadores baseados em expressao PostgREST invalida. Esses pontos foram corrigidos. O caminho da coleta esta implementado, mas so podera ser confirmado com variaveis validas e migration aplicada.

## Arquitetura atual

1. O componente `Analytics` le a preferencia em localStorage. Sem consentimento, `track()` nao envia ao GA4 nem ao endpoint proprio. Sem `NEXT_PUBLIC_GA_ID`, nao ha banner e a coleta fica desativada.
2. `lib/analytics/session.ts` gera `session_id` em sessionStorage (uma sessao por aba) e `visitor_id` em localStorage (persistente entre sessoes). Se o storage falhar, usa IDs em memoria; o visitante nao sera reconhecido apos recarregar a pagina nesse caso.
3. `POST /api/analytics/collect` aceita somente os nomes de evento conhecidos, UUIDs, caminho interno e um conjunto de propriedades limitadas. Ele faz upsert da sessao e grava evento e, para `page_view`, tambem uma linha de pageview.
4. A rota usa `SUPABASE_URL` e `SUPABASE_SECRET_KEY` apenas no servidor. Timeout e falha de armazenamento nao interrompem a navegacao; falhas de escrita retornam resposta vazia para manter a coleta silenciosa.
5. `/admin/analytics` verifica a sessao no servidor e entrega a interface de login a visitantes sem sessao. A API de dados exige cookie valido no servidor.
6. `/api/admin/analytics/session`: GET informa apenas se existe sessao e flags de configuracao; POST confere a senha; DELETE encerra a sessao. `/api/admin/analytics?days=...` exige autenticacao e consulta o Supabase.

## Autenticacao e seguranca

- `ANALYTICS_ADMIN_SECRET` e a senha do painel e tambem a chave HMAC que assina o cookie. Nao existe senha ou valor fallback no codigo. O modulo de autenticacao e marcado `server-only`.
- O cookie `analytics_admin_v1` e `HttpOnly`, `SameSite=Strict`, `Path=/`, host-only e expira em 24 horas. `Secure` e aplicado quando `NODE_ENV=production`. Logout envia o mesmo cookie com `Max-Age=0`.
- A assinatura HMAC-SHA256 e comparada em tempo constante. Rotacionar o segredo invalida as sessoes existentes. Nao ha middleware global; o componente de pagina verifica a sessao no servidor e a API de dados chama `requireAdmin()`.
- A senha trafega no corpo do POST de login; em producao, a conexao deve ser HTTPS. O valor nao e retornado em resposta nem escrito em logs pelo codigo.
- **Limitacao:** nao existe limite de tentativas de login no codigo. Antes de expor o painel publicamente, configure protecao de tentativas na borda/plataforma ou adicione rate limit compartilhado apropriado. Um contador em memoria de uma funcao serverless nao seria uma protecao confiavel.
- `SUPABASE_SECRET_KEY` tem privilegio de `service_role` e ignora RLS. O codigo usa essa chave apenas no servidor, depois de verificar o admin nas rotas de leitura. A chave nao e importada por Client Components. A chave deve ser mantida fora do bundle, Git e respostas. A documentacao oficial do Supabase confirma que chaves secretas usam `service_role` e ignoram RLS: [API keys](https://supabase.com/docs/guides/getting-started/api-keys) e [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
- As tabelas de analytics habilitam RLS, nao possuem policies para `anon` ou `authenticated`, revogam grants desses papeis e concedem acesso a `service_role`. A rota publica de coleta apenas grava eventos filtrados; nao existe rota publica de leitura. A migration da curadoria usa auth Basic independente e suas APIs continuam separadas.

### Cenarios de acesso revisados no codigo

| Caso | Resultado esperado pelo codigo |
| --- | --- |
| Sem login, abrir `/admin/analytics` | Recebe a tela de login; os dados nao sao renderizados no servidor. |
| Sem login, GET `/api/admin/analytics` | `401` de `requireAdmin()`. |
| Sem cookie, chamar API de dados | `401`. |
| Cookie expirado ou adulterado | HMAC/expiracao invalida; pagina mostra login e API retorna `401`. |
| Logout e chamada subsequente | Cookie apagado; nova consulta recebe `401`. |
| `ANALYTICS_ADMIN_SECRET` ausente | Login responde `503`; pagina fica sem acesso; API de dados retorna `401`. |
| `SUPABASE_URL` ou chave ausente | Login pode existir, mas consulta retorna `503`; coletor descarta falhas sem quebrar o site. |
| Acesso direto a endpoint de analytics em `/api/analytics/...` | A unica rota existente e POST `/api/analytics/collect`; ela nao le dados. Rotas de leitura ficam sob `/api/admin/analytics` e exigem sessao. |
| Tentativa pelo frontend de ler dados Supabase | Nao ha query Supabase no cliente nem chave secreta no bundle; o cliente so chama a API administrativa autenticada. |

Os cenarios foram verificados por leitura do codigo, nao por chamadas HTTP contra uma implantacao configurada.

## Supabase e migration

Arquivo: `supabase/migrations/202609300001_analytics.sql`.

| Tabela | Colunas e tipos | Chaves/uso |
| --- | --- | --- |
| `analytics_sessions` | `id bigint identity`, `session_id text`, `visitor_id text`, `is_new_visitor boolean`, `started_at/last_seen_at timestamptz`, `landing_page/referrer/source text`, cinco campos `utm_* text`, `device_type/os/browser text`, `viewport_width/height integer`, `country_code/region/city text`, `pageview_count/event_count integer`, `converted boolean` | PK `id`; `session_id` unique/not null. Uma linha por sessao. |
| `analytics_pageviews` | `id bigint identity`, `session_id/page_path/page_title/referrer text`, `occurred_at timestamptz`, `duration_ms integer` | PK `id`. Uma linha por pageview. |
| `analytics_events` | `id bigint identity`, `session_id/event_name/page_path text`, `occurred_at timestamptz`, `properties jsonb` | PK `id`. Uma linha por evento. |

A migration cria indices para IDs de sessao, datas, source/campaign, device, caminho e nome do evento. Nao ha foreign keys nem constraints de dominio para session IDs ou nomes de evento. A RPC `upsert_analytics_session` faz insert/update de `last_seen_at`; `purge_old_analytics` apaga dados antigos, com intervalo limitado entre 30 e 365 dias e padrao de 90 dias. Nenhum cron de retencao esta configurado no repositorio.

As colunas `pageview_count`, `event_count`, `converted`, localizacao e `duration_ms` nao sao atualizadas pelo coletor atual. O painel evita depender dos contadores antigos: pageviews sao contados da tabela de pageviews e conversoes sao sessoes distintas com evento `submit_contact`. A duracao exibida vem de `last_seen_at - started_at`. `country_code`, `region` e `city` ficam vazias; nao ha geolocalizacao por IP. As colunas `utm_content` e `utm_term` existem, mas o coletor atual nao as preenche.

As consultas usam `analytics_sessions.started_at` para sessoes/visitantes e `occurred_at` para pageviews/eventos. O periodo e rolling (agora menos N x 24h ate agora), datas ISO em UTC geradas no servidor. Nenhum dado futuro e incluído. As contagens de visitantes sao distintas por `visitor_id` entre sessoes iniciadas no intervalo; se o ID estiver ausente, usa-se o ID da sessao. Novos e recorrentes sao conjuntos distintos filtrados por `is_new_visitor`; um mesmo visitante pode aparecer em ambos se teve a primeira e uma sessao recorrente dentro do intervalo. O sinal de novo/recorrente depende do localStorage e pode reiniciar em outro dispositivo ou apos limpeza do navegador.

As consultas atuais definem limites de linhas (10 mil sessoes e 50 mil pageviews/eventos); o limite efetivo tambem depende de `Max Rows` do PostgREST no projeto. Acima dos limites, deve-se paginar ou agregar no banco; o estado e **NAO VERIFICADO** no Supabase real.

## Eventos coletados

O catalogo `EventName` inclui: `page_view`, `view_project`, `click_project`, `project_view`, `project_cta_click`, `click_whatsapp`, `click_email`, `click_linkedin`, `click_github`, `start_contact`, `submit_contact`, `scroll_50`, `scroll_75`, `scroll_90`, `setup_search`, `setup_filter`, `setup_guide_step`, `setup_guide_complete`, `setup_content_view`, `setup_product_view`, `setup_product_click` e `setup_affiliate_click`.

Os disparos estao em `Analytics`/`events.ts`, `ProjectViewTracker`, `ScrollDepth`, links rastreados, secoes de contato/projeto, `ContactForm`, guia de setup, explorer, links e visualizadores de produtos/conteudo. O coletor filtra o nome e as propriedades aceitas antes de gravar. Respostas do guia, termo digitado na busca e campos de briefing nao sao persistidos. `utm_source`, `utm_medium` e `utm_campaign` passam por filtro e limite de tamanho; `utm_content` e `utm_term` sao descartados. URLs ficam reduzidas ao caminho; referrers e `page_location` ficam reduzidos a origem/caminho sem query.

Nao existe evento `click_phone`, `briefing` ou `affiliate_click` com esses nomes exatos; o briefing usa `start_contact` e `submit_contact`, e afiliados usam `setup_affiliate_click`. `submit_contact` e o clique que abre a mensagem montada localmente no WhatsApp, nao um formulario de lead enviado ao servidor. Cliques de WhatsApp e e-mail sao contagens de eventos, nao dados pessoais. Eventos acionados por efeitos React podem duplicar em desenvolvimento com Strict Mode; nao ha deduplicacao ou retry no coletor.

## Privacidade e cookies

- Nenhum IP e gravado. O parser de User-Agent extrai tipo de dispositivo, browser e OS no servidor, descartando o texto bruto.
- `session_id` e `visitor_id` sao UUIDs aleatorios no armazenamento do navegador. O cookie administrativo e separado e HttpOnly.
- O referrer e armazenado como origem, sem caminho/query. A pagina armazenada e caminho sem query/hash.
- O nome e o texto do briefing nao entram no evento; apenas evento de inicio/envio e categoria fixa de projeto podem ser enviados.
- `localStorage` contem consentimento e identificador de visitante; `sessionStorage` contem identificador da sessao e UTMs source/medium/campaign sanitizadas. GA4 tambem pode definir seus cookies somente depois da aceitacao.
- O texto da pagina de privacidade foi atualizado para descrever o armazenamento proprio. A coleta propria depende do mesmo consentimento do banner do GA4, mas a verificacao acontece no cliente: o endpoint publico nao consegue ler o localStorage e pode receber chamadas fabricadas sem consentimento.

## Rotas e APIs

- `GET /admin/analytics`: pagina de login ou painel, com leitura do cookie no servidor.
- `GET /api/admin/analytics/session`: estado booleano da sessao e disponibilidade de configuracao, sem devolver segredos.
- `POST /api/admin/analytics/session`: login JSON `{ "password": "..." }`; retorna cookie HttpOnly.
- `DELETE /api/admin/analytics/session`: logout.
- `GET /api/admin/analytics?days=7|30|90`: dados do painel; requer sessao valida. A API aceita dias inteiros de 1 a 365.
- `POST /api/analytics/collect`: ingestao publica, sem leitura de dados e sem credencial privilegiada no cliente. A validacao de consentimento ocorre no tracker do navegador; como toda coleta web publica, chamadas fabricadas podem inserir eventos falsos.
- Nao ha rotas `/api/analytics/admin/*` nem endpoints publicos de leitura.

## Variaveis e configuracao

| Nome | Publica/secreta | Uso e obrigatoriedade | Onde configurar e como testar |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_GA_ID` | Publica (ID GA4, nao segredo) | Habilita banner, GA4 e tracker proprio; obrigatoria para coleta atual | `.env.local` e Vercel se desejado. Aceitar consentimento e observar requests no navegador/GA4. |
| `SUPABASE_URL` | URL de servidor; nao prefixar `NEXT_PUBLIC_` | Obrigatoria para coletor e painel. Tambem usada por outras integracoes Supabase existentes | `.env.local` e Vercel. Confirmar projeto correto e migration. |
| `SUPABASE_SECRET_KEY` | Segredo privilegiado | Obrigatoria para leituras/escritas server-side; atua com role `service_role`/bypass RLS | `.env.local` e Vercel, nunca no cliente. Testar somente via login e evento consentido. |
| `ANALYTICS_ADMIN_SECRET` | Segredo | Obrigatoria para login; tambem assina sessao HMAC | `.env.local` e Vercel. Abrir rota, login valido/invalido e logout. Usar segredo forte gerado pelo responsavel; valor nao incluido neste documento. |

Em `.env.local` nesta auditoria, as quatro variaveis acima estavam vazias/ausentes. Nenhum valor foi impresso. Portanto acesso real ao Supabase, login configurado e coleta em producao estao **NAO VERIFICADO**. `.env.example` agora lista `ANALYTICS_ADMIN_SECRET` sem valor.

## Configuracao manual do Supabase e Vercel

**Configuracao:** criar/selecionar um projeto Supabase e executar a migration `supabase/migrations/202609300001_analytics.sql` no SQL Editor ou por fluxo de migrations aprovado.

**Valor necessario:** URL do projeto e chave secreta Supabase (role service_role). Nao usar a chave publishable/anon para estas rotas. A chave secreta ignora RLS e tem acesso elevado; mantenha-a so no servidor.

**Onde configurar:** `.env.local` localmente; Vercel Dashboard → projeto → Settings → Environment Variables para Production e, se for validar preview, Preview. As variaveis sao aplicadas aos proximos deployments conforme a documentacao da Vercel: [Environment Variables](https://vercel.com/docs/environment-variables).

**Obrigatoria:** sim, para dados e dashboard. O Supabase Auth nao precisa de usuario administrativo; o admin usa `ANALYTICS_ADMIN_SECRET`.

**Como testar:** com ambiente configurado, aceitar consentimento em uma pagina, conferir uma linha em cada tabela conforme eventos disparados, entrar em `/admin/analytics`, selecionar periodo e conferir contagens. Aplicar migration no projeto ou alterar variaveis externamente nao foi feito nesta auditoria.

Nao criar policies publicas para essas tabelas. A migration habilita RLS, revoga acesso de `anon`/`authenticated` e concede as permissoes ao service role. Nenhuma policy ou usuario Supabase adicional e necessario para o desenho atual.

## Validacao executada e limitacoes

- `npm.cmd run typecheck`: passou.
- `npm.cmd run lint`: passou sem warnings/errors de ESLint. A ferramenta informa que `next lint` sera removido em Next 16.
- `git diff --check`: passou; Git exibiu apenas avisos de conversao LF/CRLF.
- `npm.cmd run build`: falhou antes da compilacao: o Controle de Aplicativo bloqueou o binario SWC do Windows, a variante WASM nao esta instalada e a primeira tentativa nao conseguiu criar o cache SWC em `AppData/Local/next-swc`. Build de producao **NAO VERIFICADO**.
- Nao foram executados testes automatizados nem chamadas reais a banco. Nao houve commit, push ou deploy.
- Retencao automatica, limite de tentativas, limites reais do PostgREST, migration aplicada, dados reais, acessibilidade/layout em browser e funcionamento na Vercel permanecem **NAO VERIFICADO**. Nenhum navegador estava conectado para inspecao visual.
