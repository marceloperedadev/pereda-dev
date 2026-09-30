alter table public.affiliate_oauth_tokens
  add column if not exists refresh_lock_id uuid,
  add column if not exists refresh_lock_expires_at timestamptz;

create or replace function public.claim_mercadolivre_token_refresh(
  p_lock_id uuid,
  p_lease_seconds integer default 35
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_claimed boolean := false;
begin
  update public.affiliate_oauth_tokens
  set refresh_lock_id = p_lock_id,
      refresh_lock_expires_at = pg_catalog.now() + pg_catalog.make_interval(secs => greatest(10, least(coalesce(p_lease_seconds, 35), 120)))
  where provider = 'mercadolivre'
    and (
      refresh_lock_id is null
      or refresh_lock_expires_at is null
      or refresh_lock_expires_at <= pg_catalog.now()
    )
  returning true into v_claimed;

  return coalesce(v_claimed, false);
end;
$$;

create or replace function public.complete_mercadolivre_token_refresh(
  p_lock_id uuid,
  p_access_token text,
  p_refresh_token text,
  p_expires_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_updated boolean := false;
begin
  if coalesce(p_access_token, '') = ''
    or coalesce(p_refresh_token, '') = ''
    or p_expires_at is null then
    raise exception 'Incomplete Mercado Livre token pair';
  end if;

  update public.affiliate_oauth_tokens
  set access_token = p_access_token,
      refresh_token = p_refresh_token,
      expires_at = p_expires_at,
      updated_at = pg_catalog.now(),
      refresh_lock_id = null,
      refresh_lock_expires_at = null
  where provider = 'mercadolivre'
    and refresh_lock_id = p_lock_id
  returning true into v_updated;

  return coalesce(v_updated, false);
end;
$$;

create or replace function public.release_mercadolivre_token_refresh(p_lock_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.affiliate_oauth_tokens
  set refresh_lock_id = null,
      refresh_lock_expires_at = null
  where provider = 'mercadolivre'
    and refresh_lock_id = p_lock_id;
$$;

revoke all on function public.claim_mercadolivre_token_refresh(uuid, integer) from public, anon, authenticated;
revoke all on function public.complete_mercadolivre_token_refresh(uuid, text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.release_mercadolivre_token_refresh(uuid) from public, anon, authenticated;
grant execute on function public.claim_mercadolivre_token_refresh(uuid, integer) to service_role;
grant execute on function public.complete_mercadolivre_token_refresh(uuid, text, text, timestamptz) to service_role;
grant execute on function public.release_mercadolivre_token_refresh(uuid) to service_role;
