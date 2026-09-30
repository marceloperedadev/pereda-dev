-- =============================================================
-- Analytics próprio — pereda.dev
-- Versão: 202609300001
-- =============================================================
--
-- Três tabelas:
--   analytics_sessions  — uma linha por sessão de navegação
--   analytics_pageviews — uma linha por página visitada
--   analytics_events    — todos os eventos rastreados
--
-- Localização (country_code, region, city) é opcional e nullable.
-- O sistema funciona completamente sem dados de geolocalização.
--
-- IP não é armazenado em nenhuma tabela.
-- Identificadores são anônimos (UUIDs gerados no cliente).
-- =============================================================

-- -------------------------------------------------------------
-- Sessões
-- -------------------------------------------------------------
create table if not exists public.analytics_sessions (
  id                 bigint generated always as identity primary key,

  -- Identificador anônimo da sessão (UUID gerado no navegador, vive no sessionStorage)
  session_id         text        not null unique,

  -- Identificador anônimo do visitante (UUID gerado no navegador, vive no localStorage)
  -- Permite distinguir visitantes novos de recorrentes sem identificar a pessoa
  visitor_id         text,

  is_new_visitor     boolean     not null default true,

  started_at         timestamptz not null default now(),
  last_seen_at       timestamptz not null default now(),

  -- Página de entrada
  landing_page       text,

  -- Origem
  referrer           text,
  source             text,  -- calculado: google | instagram | direct | etc.

  -- Parâmetros UTM
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_content        text,
  utm_term           text,

  -- Dispositivo (extraído do User-Agent no servidor — nunca armazenado o UA bruto)
  device_type        text,  -- desktop | mobile | tablet
  os                 text,
  browser            text,

  -- Viewport (enviado pelo cliente)
  viewport_width     integer,
  viewport_height    integer,

  -- Geolocalização (opcional, nullable — não implementado na v1)
  country_code       text,
  region             text,
  city               text,

  -- Contadores desnormalizados para consultas rápidas
  pageview_count     integer     not null default 0,
  event_count        integer     not null default 0,

  -- Indica que a sessão gerou pelo menos uma conversão (submit_contact)
  converted          boolean     not null default false
);

create index if not exists analytics_sessions_session_id_idx
  on public.analytics_sessions (session_id);

create index if not exists analytics_sessions_started_at_idx
  on public.analytics_sessions (started_at desc);

create index if not exists analytics_sessions_last_seen_at_idx
  on public.analytics_sessions (last_seen_at desc);

create index if not exists analytics_sessions_source_idx
  on public.analytics_sessions (source);

create index if not exists analytics_sessions_utm_campaign_idx
  on public.analytics_sessions (utm_campaign)
  where utm_campaign is not null;

create index if not exists analytics_sessions_device_type_idx
  on public.analytics_sessions (device_type);

-- -------------------------------------------------------------
-- Pageviews
-- -------------------------------------------------------------
create table if not exists public.analytics_pageviews (
  id           bigint generated always as identity primary key,
  session_id   text        not null,
  page_path    text        not null,
  page_title   text,
  referrer     text,
  occurred_at  timestamptz not null default now(),
  -- Duração em ms — preenchida quando o visitante navega para outra página
  duration_ms  integer
);

create index if not exists analytics_pageviews_session_id_idx
  on public.analytics_pageviews (session_id);

create index if not exists analytics_pageviews_occurred_at_idx
  on public.analytics_pageviews (occurred_at desc);

create index if not exists analytics_pageviews_page_path_idx
  on public.analytics_pageviews (page_path);

-- -------------------------------------------------------------
-- Eventos
-- -------------------------------------------------------------
create table if not exists public.analytics_events (
  id           bigint generated always as identity primary key,
  session_id   text        not null,
  event_name   text        not null,
  page_path    text,
  occurred_at  timestamptz not null default now(),
  -- Dados adicionais do evento (project_name, cta_location, etc.)
  -- Nunca armazena: senha, CPF, dados bancários, conteúdo de formulários
  properties   jsonb
);

create index if not exists analytics_events_session_id_idx
  on public.analytics_events (session_id);

create index if not exists analytics_events_occurred_at_idx
  on public.analytics_events (occurred_at desc);

create index if not exists analytics_events_event_name_idx
  on public.analytics_events (event_name);

create index if not exists analytics_events_page_path_idx
  on public.analytics_events (page_path)
  where page_path is not null;

-- -------------------------------------------------------------
-- RLS — mesma política das outras tabelas do projeto
-- -------------------------------------------------------------
alter table public.analytics_sessions   enable row level security;
alter table public.analytics_pageviews  enable row level security;
alter table public.analytics_events     enable row level security;

revoke all on public.analytics_sessions   from anon, authenticated;
revoke all on public.analytics_pageviews  from anon, authenticated;
revoke all on public.analytics_events     from anon, authenticated;

grant all on public.analytics_sessions   to service_role;
grant all on public.analytics_pageviews  to service_role;
grant all on public.analytics_events     to service_role;

grant usage, select on sequence analytics_sessions_id_seq   to service_role;
grant usage, select on sequence analytics_pageviews_id_seq  to service_role;
grant usage, select on sequence analytics_events_id_seq     to service_role;

-- -------------------------------------------------------------
-- Função de upsert de sessão (evita race condition em múltiplos eventos simultâneos)
-- -------------------------------------------------------------
create or replace function public.upsert_analytics_session(
  p_session_id        text,
  p_visitor_id        text,
  p_is_new_visitor    boolean,
  p_landing_page      text,
  p_referrer          text,
  p_source            text,
  p_utm_source        text,
  p_utm_medium        text,
  p_utm_campaign      text,
  p_utm_content       text,
  p_utm_term          text,
  p_device_type       text,
  p_os                text,
  p_browser           text,
  p_viewport_width    integer,
  p_viewport_height   integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.analytics_sessions (
    session_id, visitor_id, is_new_visitor,
    landing_page, referrer, source,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    device_type, os, browser,
    viewport_width, viewport_height,
    last_seen_at
  ) values (
    p_session_id, p_visitor_id, p_is_new_visitor,
    p_landing_page, p_referrer, p_source,
    p_utm_source, p_utm_medium, p_utm_campaign, p_utm_content, p_utm_term,
    p_device_type, p_os, p_browser,
    p_viewport_width, p_viewport_height,
    now()
  )
  on conflict (session_id) do update set
    last_seen_at = now();
end;
$$;

revoke all on function public.upsert_analytics_session(text,text,boolean,text,text,text,text,text,text,text,text,text,text,text,integer,integer) from public, anon, authenticated;
grant execute on function public.upsert_analytics_session(text,text,boolean,text,text,text,text,text,text,text,text,text,text,text,integer,integer) to service_role;

-- -------------------------------------------------------------
-- Política de retenção automática — remove registros antigos
-- A função pode ser chamada por um cron externo (Vercel Cron ou Supabase pg_cron)
-- Padrão: 90 dias (configurável via parâmetro)
-- -------------------------------------------------------------
create or replace function public.purge_old_analytics(p_days integer default 90)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_cutoff timestamptz := now() - make_interval(days => greatest(30, least(p_days, 365)));
begin
  delete from public.analytics_events
  where occurred_at < v_cutoff;

  delete from public.analytics_pageviews
  where occurred_at < v_cutoff;

  delete from public.analytics_sessions
  where last_seen_at < v_cutoff;
end;
$$;

revoke all on function public.purge_old_analytics(integer) from public, anon, authenticated;
grant execute on function public.purge_old_analytics(integer) to service_role;
