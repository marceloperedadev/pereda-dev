create table if not exists public.curated_products (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider ~ '^[a-z0-9_-]{2,40}$'),
  source_product_id text not null,
  slug text unique,
  editorial_title text,
  suitable_for text,
  recommendation_reason text,
  limitations text,
  contexts text[] not null default '{}',
  affiliate_url text,
  source_title text,
  source_url text,
  source_image_url text,
  source_category_id text,
  source_condition text,
  source_seller_id text,
  source_status text not null default 'unknown',
  price numeric(12,2),
  currency text,
  curation_status text not null default 'discovered'
    check (curation_status in ('discovered', 'review', 'approved', 'published', 'expired')),
  first_seen_at timestamptz not null default now(),
  last_checked_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (provider, source_product_id)
);

create index if not exists curated_products_publication_idx
  on public.curated_products (curation_status, last_checked_at desc);
create index if not exists curated_products_review_idx
  on public.curated_products (curation_status, updated_at desc);

create table if not exists public.setup_price_history (
  id bigint generated always as identity primary key,
  curated_product_id uuid not null references public.curated_products(id) on delete cascade,
  price numeric(12,2) not null check (price >= 0),
  previous_price numeric(12,2),
  currency text not null,
  checked_at timestamptz not null default now()
);

create index if not exists setup_price_history_product_time_idx
  on public.setup_price_history (curated_product_id, checked_at desc);

-- Os quatro anúncios de afiliado já cadastrados no conteúdo entram somente
-- na fila privada; a migration não os aprova nem os publica automaticamente.
insert into public.curated_products (provider, source_product_id, affiliate_url, contexts)
values
  ('mercadolivre', 'MLB5171883451', 'https://meli.la/2VuYxGP', array['gaming', 'uso-geral']),
  ('mercadolivre', 'MLB4452425949', 'https://meli.la/1D6vYQN', array['gaming', 'trabalho']),
  ('mercadolivre', 'MLB4464700619', 'https://meli.la/1BP6m8N', array['gaming', 'uso-geral']),
  ('mercadolivre', 'MLB5687307630', 'https://meli.la/2N46ZkQ', array['gaming', 'programacao', 'trabalho'])
on conflict (provider, source_product_id) do nothing;

alter table public.curated_products enable row level security;
alter table public.setup_price_history enable row level security;
revoke all on public.curated_products from anon, authenticated;
revoke all on public.setup_price_history from anon, authenticated;
grant all on public.curated_products to service_role;
grant all on public.setup_price_history to service_role;

create or replace function public.sync_curated_product(p_listing jsonb, p_contexts text[] default '{}')
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_previous_price numeric(12,2);
  v_previous_currency text;
  v_price numeric(12,2);
  v_currency text;
begin
  if coalesce(p_listing->>'provider', '') !~ '^[a-z0-9_-]{2,40}$'
    or coalesce(p_listing->>'sourceProductId', '') = ''
    or coalesce(p_listing->>'listingStatus', '') <> 'active' then
    raise exception 'Invalid or inactive catalog listing';
  end if;

  perform pg_advisory_xact_lock(hashtext((p_listing->>'provider') || ':' || (p_listing->>'sourceProductId')));

  v_price := nullif(p_listing->>'price', '')::numeric(12,2);
  v_currency := nullif(p_listing->>'currency', '');

  insert into public.curated_products as existing (
    provider, source_product_id, source_title, source_url, source_image_url,
    source_category_id, source_condition, source_seller_id, source_status,
    price, currency, contexts, curation_status, last_checked_at, updated_at
  ) values (
    p_listing->>'provider', p_listing->>'sourceProductId',
    nullif(p_listing->>'title', ''), nullif(p_listing->>'sourceUrl', ''),
    nullif(p_listing->>'imageUrl', ''), nullif(p_listing->>'categoryId', ''),
    nullif(p_listing->>'condition', ''), nullif(p_listing->>'sellerId', ''),
    p_listing->>'listingStatus', v_price, v_currency,
    coalesce(p_contexts, '{}'), 'discovered', now(), now()
  )
  on conflict (provider, source_product_id) do update set
    source_title = excluded.source_title,
    source_url = excluded.source_url,
    source_image_url = excluded.source_image_url,
    source_category_id = excluded.source_category_id,
    source_condition = excluded.source_condition,
    source_seller_id = excluded.source_seller_id,
    source_status = excluded.source_status,
    price = excluded.price,
    currency = excluded.currency,
    curation_status = case when existing.curation_status = 'expired' then 'discovered' else existing.curation_status end,
    last_checked_at = now(),
    updated_at = now()
  returning id into v_id;

  select h.price, h.currency into v_previous_price, v_previous_currency
  from public.setup_price_history h
  where h.curated_product_id = v_id
  order by h.checked_at desc, h.id desc
  limit 1;

  if v_price is not null and v_currency is not null
    and (v_previous_price is null or v_previous_price is distinct from v_price or v_previous_currency is distinct from v_currency) then
    insert into public.setup_price_history (curated_product_id, price, previous_price, currency)
    values (v_id, v_price, case when v_previous_currency = v_currency then v_previous_price else null end, v_currency);
  end if;

  return v_id;
end;
$$;

create or replace function public.expire_curated_product(p_provider text, p_source_product_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  update public.curated_products
  set curation_status = 'expired',
      source_title = null,
      source_url = null,
      source_image_url = null,
      source_category_id = null,
      source_condition = null,
      source_seller_id = null,
      source_status = 'unavailable',
      price = null,
      currency = null,
      last_checked_at = now(),
      updated_at = now()
  where provider = p_provider and source_product_id = p_source_product_id
  returning id into v_id;

  if v_id is not null then
    delete from public.setup_price_history where curated_product_id = v_id;
  end if;
end;
$$;

revoke all on function public.sync_curated_product(jsonb, text[]) from public, anon, authenticated;
revoke all on function public.expire_curated_product(text, text) from public, anon, authenticated;
grant execute on function public.sync_curated_product(jsonb, text[]) to service_role;
grant execute on function public.expire_curated_product(text, text) to service_role;
