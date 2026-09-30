create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  project_data jsonb not null,
  status text not null default 'draft' check (status in ('draft','analyzing','needs_info','review','published','archived')),
  source_url text,
  source_facts jsonb not null default '{}'::jsonb,
  pending_confirmations text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_projects_status_updated_idx on public.portfolio_projects(status, updated_at desc);
create table if not exists public.portfolio_project_revisions (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  project_data jsonb not null,
  status text not null,
  changed_at timestamptz not null default now()
);
create index if not exists portfolio_project_revisions_project_time_idx on public.portfolio_project_revisions(project_id, changed_at desc);
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_project_revisions enable row level security;
revoke all on public.portfolio_projects, public.portfolio_project_revisions from anon, authenticated;
grant all on public.portfolio_projects, public.portfolio_project_revisions to service_role;
