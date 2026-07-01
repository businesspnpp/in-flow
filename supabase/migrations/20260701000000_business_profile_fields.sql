-- Add editable profile fields for dashboard settings
-- Safe to run multiple times due to IF NOT EXISTS checks

alter table public.businesses
  add column if not exists owner_name text,
  add column if not exists timezone text not null default 'Africa/Johannesburg',
  add column if not exists currency text not null default 'ZAR',
  add column if not exists booking_buffer_minutes integer not null default 15;

-- Keep data quality predictable
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_currency_check'
  ) then
    alter table public.businesses
      add constraint businesses_currency_check
      check (currency in ('ZAR', 'USD', 'EUR'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_booking_buffer_minutes_check'
  ) then
    alter table public.businesses
      add constraint businesses_booking_buffer_minutes_check
      check (booking_buffer_minutes >= 0 and booking_buffer_minutes <= 180);
  end if;
end $$;

-- Backfill owner_name for existing rows where absent
update public.businesses
set owner_name = coalesce(owner_name, business_name)
where owner_name is null;
