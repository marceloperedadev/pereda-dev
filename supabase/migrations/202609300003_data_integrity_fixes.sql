-- Keep analytics counters in sync with the event tables. The original
-- collector wrote pageviews and events without maintaining these columns.
update public.analytics_sessions s
set pageview_count = (
      select count(*)::integer
      from public.analytics_pageviews p
      where p.session_id = s.session_id
    ),
    event_count = (
      select count(*)::integer
      from public.analytics_events e
      where e.session_id = s.session_id
    ),
    converted = exists (
      select 1
      from public.analytics_events e
      where e.session_id = s.session_id and e.event_name = 'submit_contact'
    );

create or replace function public.sync_analytics_session_counters()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session_id text;
  v_delta integer;
  v_conversion boolean := false;
begin
  if tg_op = 'UPDATE' then
    return new;
  end if;

  v_session_id := case when tg_op = 'INSERT' then new.session_id else old.session_id end;
  v_delta := case when tg_op = 'INSERT' then 1 else -1 end;

  if tg_table_name = 'analytics_pageviews' then
    update public.analytics_sessions
    set pageview_count = greatest(0, pageview_count + v_delta)
    where session_id = v_session_id;
  else
    if tg_op = 'INSERT' and new.event_name = 'submit_contact' then
      v_conversion := true;
    end if;
    update public.analytics_sessions
    set event_count = greatest(0, event_count + v_delta),
        converted = converted or v_conversion
    where session_id = v_session_id;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists analytics_pageviews_sync_session_counters on public.analytics_pageviews;
create trigger analytics_pageviews_sync_session_counters
after insert or delete on public.analytics_pageviews
for each row execute function public.sync_analytics_session_counters();

drop trigger if exists analytics_events_sync_session_counters on public.analytics_events;
create trigger analytics_events_sync_session_counters
after insert or delete on public.analytics_events
for each row execute function public.sync_analytics_session_counters();

revoke all on function public.sync_analytics_session_counters() from public, anon, authenticated;
grant execute on function public.sync_analytics_session_counters() to service_role;

-- Explicit sequence access keeps identity inserts reliable through PostgREST.
grant usage, select on sequence public.setup_price_history_id_seq to service_role;
grant usage, select on sequence public.portfolio_project_revisions_id_seq to service_role;

-- If an expired Mercado Livre listing returns, require a fresh editorial pass.
create or replace function public.reset_expired_curated_product_editorial()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.curation_status = 'expired' and new.curation_status <> 'expired' then
    new.slug := null;
    new.editorial_title := null;
    new.suitable_for := null;
    new.recommendation_reason := null;
    new.limitations := null;
    new.affiliate_url := null;
    new.curation_status := 'discovered';
  end if;
  return new;
end;
$$;

drop trigger if exists curated_products_reset_expired_editorial on public.curated_products;
create trigger curated_products_reset_expired_editorial
before update of curation_status on public.curated_products
for each row execute function public.reset_expired_curated_product_editorial();

revoke all on function public.reset_expired_curated_product_editorial() from public, anon, authenticated;
