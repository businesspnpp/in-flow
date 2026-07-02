-- Settings sections persistence tables
-- Notifications, Security, and Team Access

create table if not exists public.business_notification_settings (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  booking_reminders boolean not null default true,
  payment_alerts boolean not null default true,
  weekly_digest boolean not null default false,
  outage_alerts boolean not null default true,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

create table if not exists public.business_security_settings (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  two_factor_enabled boolean not null default true,
  active_sessions integer not null default 1,
  password_changed_at date not null default current_date,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint business_security_settings_active_sessions_check check (active_sessions >= 0)
);

create table if not exists public.business_team_access_settings (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  admins_count integer not null default 1,
  operators_count integer not null default 0,
  pending_invites_count integer not null default 0,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint business_team_access_settings_admins_count_check check (admins_count >= 0),
  constraint business_team_access_settings_operators_count_check check (operators_count >= 0),
  constraint business_team_access_settings_pending_invites_count_check check (pending_invites_count >= 0)
);

-- Seed defaults for existing businesses
insert into public.business_notification_settings (business_id)
select b.id
from public.businesses b
where not exists (
  select 1 from public.business_notification_settings n where n.business_id = b.id
);

insert into public.business_security_settings (business_id)
select b.id
from public.businesses b
where not exists (
  select 1 from public.business_security_settings s where s.business_id = b.id
);

insert into public.business_team_access_settings (business_id)
select b.id
from public.businesses b
where not exists (
  select 1 from public.business_team_access_settings t where t.business_id = b.id
);
