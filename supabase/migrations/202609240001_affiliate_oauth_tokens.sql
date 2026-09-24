create table if not exists public.affiliate_oauth_tokens (
  provider text primary key,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now(),
  constraint affiliate_oauth_tokens_known_provider
    check (provider in ('mercadolivre'))
);

alter table public.affiliate_oauth_tokens enable row level security;
revoke all on public.affiliate_oauth_tokens from anon, authenticated;
grant all on public.affiliate_oauth_tokens to service_role;
