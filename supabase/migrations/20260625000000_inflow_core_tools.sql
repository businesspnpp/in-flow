-- ════════════════════════════════════════════════════════════════════════
-- inFlow — Supabase PostgreSQL Migration
-- File: supabase/migrations/20260625000000_inflow_core_tools.sql
--
-- Assumes these tables ALREADY EXIST (per lib/supabase.ts):
--   businesses (id, business_name, categories text[], address, email,
--               whatsapp_number, whatsapp_verified, whatsapp_waba_id,
--               whatsapp_phone_number_id, whatsapp_access_token,
--               created_at, updated_at)
--   chats      (id, name, last_message, updated_at)
--   messages   (id, chat_id, sender, body, created_at)
--
-- This migration ONLY adds new tables required by the 7 native tools +
-- AI context extractor. It does NOT alter businesses/chats/messages,
-- per the architectural requirement to keep plugin config out of the
-- main businesses table.
-- ════════════════════════════════════════════════════════════════════════

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ───────────────────────────────────────────────────────────────────────
-- 1. inflow_plugin_configurations
-- ───────────────────────────────────────────────────────────────────────
-- One row per business. Each native tool's settings live in its own
-- JSONB column so individual tool configs can evolve independently.

create table if not exists inflow_plugin_configurations (
  id                      uuid primary key default gen_random_uuid(),
  business_id             uuid not null references businesses(id) on delete cascade,
  auto_read_chat_context  boolean not null default true,

  invoice_quote_config    jsonb not null default '{
    "autoReadChatContext": true,
    "defaultCurrency": "ZAR",
    "invoiceNumberPrefix": "INV-2026-",
    "nextInvoiceSequence": 1,
    "paymentTerms": "Due within 7 days",
    "defaultVatPercent": 15
  }'::jsonb,

  booked_it_config        jsonb not null default '{
    "isConfigured": false,
    "weeklyAvailability": {
      "monday":    {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "tuesday":   {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "wednesday": {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "thursday":  {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "friday":    {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "saturday":  {"enabled": true,  "startTime": "09:00", "endTime": "13:00"},
      "sunday":    {"enabled": false, "startTime": null,    "endTime": null}
    },
    "appointmentTypes": [],
    "bufferMinutes": 15,
    "maxBookingsPerDay": null,
    "calendarSync": {
      "provider": null,
      "connected": false,
      "refreshTokenRef": null,
      "calendarId": null
    }
  }'::jsonb,

  menu_config              jsonb not null default '{
    "isConfigured": true,
    "mediaLibraryBucket": "inflow-media",
    "defaultIntroMessage": "Here'\''s our latest menu! 📋"
  }'::jsonb,

  pay_now_config           jsonb not null default '{
    "isConfigured": false,
    "payoutProvider": null,
    "subAccountId": null,
    "acceptedMethods": ["Card", "Instant EFT", "Capitec Pay"]
  }'::jsonb,

  review_config            jsonb not null default '{
    "googleReviewUrl": null,
    "autoPromptOnPaymentSuccess": true,
    "defaultTemplateId": "standard"
  }'::jsonb,

  promo_config             jsonb not null default '{
    "defaultExpiryDays": 7,
    "staleThreadDays": 3
  }'::jsonb,

  created_at               timestamptz not null default now(),
  updated_at                timestamptz not null default now(),

  constraint inflow_plugin_configurations_business_unique unique (business_id)
);

create index if not exists idx_inflow_plugin_configs_business
  on inflow_plugin_configurations(business_id);

-- ───────────────────────────────────────────────────────────────────────
-- 2. inflow_items_catalog
-- ───────────────────────────────────────────────────────────────────────
-- Products, services, and menu items — fully end-user editable from the
-- dashboard settings panel. Seeded with realistic SA small-business
-- defaults so Invoice/Quote work out-of-the-box (see seed script).

create table if not exists inflow_items_catalog (
  id                uuid primary key default gen_random_uuid(),
  business_id       uuid not null references businesses(id) on delete cascade,
  kind              text not null default 'service'
                      check (kind in ('service', 'product', 'menu_item')),
  name              text not null,
  description       text,
  price             numeric(10,2) not null default 0,
  currency          text not null default 'ZAR',
  duration_minutes  integer,
  is_active         boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_inflow_catalog_business
  on inflow_items_catalog(business_id);
create index if not exists idx_inflow_catalog_active
  on inflow_items_catalog(business_id, is_active);

-- ───────────────────────────────────────────────────────────────────────
-- 3. inflow_bookings
-- ───────────────────────────────────────────────────────────────────────
-- The virtual calendar ledger for BookedIt. A row here blocks out a slot
-- so no other client can override it.

create table if not exists inflow_bookings (
  id                      uuid primary key default gen_random_uuid(),
  business_id             uuid not null references businesses(id) on delete cascade,
  chat_id                 uuid references chats(id) on delete set null,
  appointment_type_id     text,
  customer_name           text,
  customer_phone          text,
  booking_date            date not null,
  start_time              time not null,
  end_time                time not null,
  status                  text not null default 'confirmed'
                            check (status in ('confirmed', 'cancelled', 'completed', 'no_show')),
  source                  text not null default 'manual_override'
                            check (source in ('manual_override', 'public_link')),
  public_booking_token    text unique,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_inflow_bookings_business_date
  on inflow_bookings(business_id, booking_date);

-- Prevent double-booking the exact same business/date/start_time when confirmed
create unique index if not exists uniq_inflow_bookings_slot
  on inflow_bookings(business_id, booking_date, start_time)
  where status = 'confirmed';

-- ───────────────────────────────────────────────────────────────────────
-- 4. inflow_invoices  (covers both Invoice & Quote tools)
-- ───────────────────────────────────────────────────────────────────────

create table if not exists inflow_invoices (
  id                  uuid primary key default gen_random_uuid(),
  business_id         uuid not null references businesses(id) on delete cascade,
  chat_id             uuid references chats(id) on delete set null,
  type                text not null check (type in ('invoice', 'quote')),
  reference           text not null,
  customer_name       text,
  customer_phone      text,
  line_items          jsonb not null default '[]'::jsonb,
  subtotal            numeric(10,2) not null default 0,
  vat_amount          numeric(10,2) not null default 0,
  total               numeric(10,2) not null default 0,
  currency            text not null default 'ZAR',
  status              text not null default 'draft'
                        check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_intent_id   uuid,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint inflow_invoices_reference_unique unique (business_id, reference)
);

create index if not exists idx_inflow_invoices_business
  on inflow_invoices(business_id);
create index if not exists idx_inflow_invoices_chat
  on inflow_invoices(chat_id);
create index if not exists idx_inflow_invoices_status
  on inflow_invoices(business_id, status);

-- ───────────────────────────────────────────────────────────────────────
-- 5. inflow_payment_intents
-- ───────────────────────────────────────────────────────────────────────

create table if not exists inflow_payment_intents (
  id                   uuid primary key default gen_random_uuid(),
  business_id          uuid not null references businesses(id) on delete cascade,
  invoice_id           uuid references inflow_invoices(id) on delete set null,
  amount               numeric(10,2) not null,
  currency             text not null default 'ZAR',
  short_link_token     text not null unique,
  provider             text not null check (provider in ('payfast', 'yoco')),
  provider_reference   text,
  status               text not null default 'pending'
                         check (status in ('pending', 'success', 'failed', 'expired')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Now that inflow_payment_intents exists, wire up the FK from invoices
alter table inflow_invoices
  drop constraint if exists inflow_invoices_payment_intent_fkey;
alter table inflow_invoices
  add constraint inflow_invoices_payment_intent_fkey
  foreign key (payment_intent_id) references inflow_payment_intents(id) on delete set null;

create index if not exists idx_inflow_payment_intents_business
  on inflow_payment_intents(business_id);
create index if not exists idx_inflow_payment_intents_token
  on inflow_payment_intents(short_link_token);

-- ───────────────────────────────────────────────────────────────────────
-- 6. inflow_vouchers  (Promo tool)
-- ───────────────────────────────────────────────────────────────────────

create table if not exists inflow_vouchers (
  id               uuid primary key default gen_random_uuid(),
  business_id      uuid not null references businesses(id) on delete cascade,
  code             text not null,
  discount_label   text not null,
  discount_type    text not null default 'percentage'
                     check (discount_type in ('percentage', 'fixed_amount', 'free_item', 'other')),
  discount_value   numeric(10,2),
  flyer_media_url  text,
  expires_at       timestamptz,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),

  constraint inflow_vouchers_code_unique unique (business_id, code)
);

create index if not exists idx_inflow_vouchers_business
  on inflow_vouchers(business_id, is_active);

-- ───────────────────────────────────────────────────────────────────────
-- 7. inflow_media_assets  (Menu tool's uploaded PDFs/JPGs/PNGs)
-- ───────────────────────────────────────────────────────────────────────

create table if not exists inflow_media_assets (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  label        text not null,
  file_url     text not null,
  file_type    text not null check (file_type in ('pdf', 'jpg', 'png')),
  created_at   timestamptz not null default now()
);

create index if not exists idx_inflow_media_assets_business
  on inflow_media_assets(business_id);

-- ───────────────────────────────────────────────────────────────────────
-- 8. updated_at auto-touch trigger (shared helper)
-- ───────────────────────────────────────────────────────────────────────

create or replace function inflow_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_inflow_plugin_configs_updated on inflow_plugin_configurations;
create trigger trg_inflow_plugin_configs_updated
  before update on inflow_plugin_configurations
  for each row execute function inflow_set_updated_at();

drop trigger if exists trg_inflow_catalog_updated on inflow_items_catalog;
create trigger trg_inflow_catalog_updated
  before update on inflow_items_catalog
  for each row execute function inflow_set_updated_at();

drop trigger if exists trg_inflow_bookings_updated on inflow_bookings;
create trigger trg_inflow_bookings_updated
  before update on inflow_bookings
  for each row execute function inflow_set_updated_at();

drop trigger if exists trg_inflow_invoices_updated on inflow_invoices;
create trigger trg_inflow_invoices_updated
  before update on inflow_invoices
  for each row execute function inflow_set_updated_at();

drop trigger if exists trg_inflow_payment_intents_updated on inflow_payment_intents;
create trigger trg_inflow_payment_intents_updated
  before update on inflow_payment_intents
  for each row execute function inflow_set_updated_at();

-- ───────────────────────────────────────────────────────────────────────
-- 9. Row Level Security
-- ───────────────────────────────────────────────────────────────────────
-- NOTE: businesses.id is assumed to map 1:1 to an authenticated owner.
-- Adjust the `owner_user_id` lookup below if `businesses` uses a
-- different ownership column than the one assumed here (check your
-- existing businesses RLS policy and mirror its predicate exactly).

alter table inflow_plugin_configurations enable row level security;
alter table inflow_items_catalog          enable row level security;
alter table inflow_bookings               enable row level security;
alter table inflow_invoices               enable row level security;
alter table inflow_payment_intents        enable row level security;
alter table inflow_vouchers               enable row level security;
alter table inflow_media_assets           enable row level security;

-- Generic "owner can do everything on rows belonging to their business"
-- pattern. Replace `businesses.id = auth.uid()` below with whatever
-- predicate your existing `businesses` table policies use if ownership
-- is tracked via a separate join table instead.

create policy if not exists "Owner manages plugin configs"
  on inflow_plugin_configurations for all
  using (business_id in (select id from businesses where id = auth.uid()))
  with check (business_id in (select id from businesses where id = auth.uid()));

create policy if not exists "Owner manages catalog items"
  on inflow_items_catalog for all
  using (business_id in (select id from businesses where id = auth.uid()))
  with check (business_id in (select id from businesses where id = auth.uid()));

create policy if not exists "Owner manages bookings"
  on inflow_bookings for all
  using (business_id in (select id from businesses where id = auth.uid()))
  with check (business_id in (select id from businesses where id = auth.uid()));

create policy if not exists "Owner manages invoices"
  on inflow_invoices for all
  using (business_id in (select id from businesses where id = auth.uid()))
  with check (business_id in (select id from businesses where id = auth.uid()));

create policy if not exists "Owner manages payment intents"
  on inflow_payment_intents for all
  using (business_id in (select id from businesses where id = auth.uid()))
  with check (business_id in (select id from businesses where id = auth.uid()));

create policy if not exists "Owner manages vouchers"
  on inflow_vouchers for all
  using (business_id in (select id from businesses where id = auth.uid()))
  with check (business_id in (select id from businesses where id = auth.uid()));

create policy if not exists "Owner manages media assets"
  on inflow_media_assets for all
  using (business_id in (select id from businesses where id = auth.uid()))
  with check (business_id in (select id from businesses where id = auth.uid()));
