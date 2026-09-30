# Auditoria e administração de projetos

## Escopo e evidência

Auditoria estática do repositório local em 30/09/2026. Não houve acesso à produção, ao Supabase remoto nem aos quatro endereços externos listados no catálogo. Portanto disponibilidade, implementação atualmente publicada e stack dos sites externos não foram verificados neste trabalho.

## Arquitetura encontrada

- Next.js 15.5.26 com App Router, React 19 e TypeScript.
- Projetos eram definidos em `lib/data/projects.ts` e servidos pelas rotas `/projetos` e `/projetos/[slug]`.
- O catálogo contém 4 registros: Mimo Pet, Pereda Engenharia, Ortoclínica Taubaté e Dra. Valesca. Cada registro tem categoria/tipo, textos de case, funcionalidades, decisões, tags, stack cadastrada, URL pública e imagem de capa local. Essas afirmações são conteúdo existente no repositório, não uma verificação independente dos projetos externos.
- Não havia criação/edição administrativa de projetos, upload, tabela de cases, histórico ou estado de publicação por projeto.
- O admin existente era de Analytics e Curadoria. A autenticação administrativa usa `ANALYTICS_ADMIN_SECRET` com cookie HMAC HttpOnly e SameSite Strict; as APIs devem validar esse cookie. O acesso privado ao Supabase usa `SUPABASE_URL` e `SUPABASE_SECRET_KEY` apenas no servidor.
- O sitemap era construído a partir do catálogo estático e já incluía dados SEO existentes. Páginas públicas de case usam metadata e JSON-LD.

## Segurança e limitações

- `ANALYTICS_ADMIN_SECRET`, `SUPABASE_URL` e `SUPABASE_SECRET_KEY` não estão configurados no `.env.local` lido nesta auditoria; nenhum valor secreto foi exibido. Assim, login, gravação, histórico e publicação não puderam ser testados contra banco real.
- Análise URL usa HTTPS, rejeita credenciais/portas e nomes locais, resolve DNS, rejeita endereços privados e fixa IP público na conexão TLS. Redirecionamentos são limitados e revalidados; há limite de 1 MB, HTML somente e timeout de 7 s.
- A análise extrai apenas title, Open Graph title/description/image/site name. Ela não confirma código, tecnologia, dados privados, recursos internos, objetivos, métricas ou resultados de vendas.
- XSS é mitigado pela renderização textual do React e validação de URLs. APIs administrativas requerem sessão. Limitação atual: não foi adicionada limitação de taxa por usuário; o painel pressupõe administrador único e consulta externa limitada por timeout/tamanho.
- Não há integração de IA nem chave de provedor configurada. A aplicação não envia dados a serviços de IA.
- Não há upload de imagens. A interface aceita caminho de imagem local já existente em `public/`; não baixa imagens externas e alerta sobre autorização.

## Mudanças

A migration `202609300002_portfolio_projects_admin.sql` cria `portfolio_projects` e `portfolio_project_revisions`, com RLS habilitada e grants restritos a `service_role`. A migração é local ao repositório e não foi aplicada remotamente.

O painel em `/admin/projetos` usa a autenticação admin existente, lista os quatro cases estáticos e registros gerenciáveis, pesquisa por nome, filtra categoria/status, permite editar/criar, importar metadados por URL, listar confirmações pendentes, salvar rascunhos, revisar histórico, publicar após confirmação e arquivar. Antes de salvar alterações de item publicado, o status vai para revisão. Publicar exige os campos de case e nenhuma pendência aberta.

Cases gerenciados publicados alimentam a listagem, a página do case e sitemap. Cases estáticos continuam como fallback até uma versão administrada ser publicada. Cases arquivados administrados são removidos da apresentação pública.

## Auditoria individual do catálogo

| Projeto cadastrado | Conteúdo disponível no repositório | Verificação externa |
| --- | --- | --- |
| Mimo Pet | Site/loja; descrição de catálogo, carrinho, checkout e contato; stack registrada como Next.js/TypeScript/React; capa descrita como mockup ilustrativo. | Não realizada |
| Pereda Engenharia | Landing page de engenharia civil; apresentação de serviços e chamadas de contato; stack registrada como Next.js/TypeScript/React; capa descrita como mockup ilustrativo. | Não realizada |
| Ortoclínica Taubaté | Site institucional de clínica; áreas de atendimento e contato; stack registrada como Next.js/TypeScript/React; capa descrita como mockup ilustrativo. | Não realizada |
| Dra. Valesca | Modelo de site profissional odontológico; apresentação, serviços e contato; stack registrada como Next.js/TypeScript/React; capa descrita como mockup ilustrativo. | Não realizada |

Nenhum estudo de caso dos registros antigos foi substituído. Não foi produzido texto gerado por IA. Informações comerciais do cadastro antigo aguardam validação com o responsável, especialmente necessidade original, resultados e autorização de materiais.

## Pendências conhecidas

- Aplicar a migration no ambiente Supabase apropriado e configurar variáveis no servidor.
- Executar testes funcionais de autenticação, gravação, revisões, publicação e sitemap com banco configurado.
- Adicionar armazenamento/upload seguro se necessário.
- Configurar um provedor de IA com chave privada, política de dados e avaliação editorial caso geração por IA seja desejada.
- Ampliar a comparação visual de versões e o gerenciamento de imagens; hoje o histórico é consultável como dados e conteúdo pode ser comparado manualmente.
