-- ════════════════════════════════════════════════════════════════════════
-- inFlow — Seed Script (SQL)
-- File: supabase/seed.sql
--
-- Run AFTER the migration. Seeds one demo business's catalog, plugin
-- config defaults, a sample voucher, and a sample media asset so the
-- dashboard is instantly testable.
--
-- Replace :business_id with a real businesses.id before running, e.g.:
--   psql ... -v business_id="'8f14e45f-...'"
-- or just substitute the literal UUID directly.
-- ════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 0. Pick (or create) the demo business to seed against
-- ───────────────────────────────────────────────────────────────────────
-- If you already have a business row from signup, skip this insert and
-- just set :business_id to that row's id when running this script.

insert into businesses (id, business_name, categories, address, email)
values (
  '00000000-0000-0000-0000-000000000001',
  'Thabo''s Auto & Styling Hub',
  array['Automotive', 'Hair & Beauty'],
  '14 Bree Street, Johannesburg, Gauteng',
  'demo@inflow.to'
)
on conflict (id) do nothing;

-- ───────────────────────────────────────────────────────────────────────
-- 1. inflow_plugin_configurations — defaults for the demo business
-- ───────────────────────────────────────────────────────────────────────

insert into inflow_plugin_configurations (
  business_id,
  auto_read_chat_context,
  invoice_quote_config,
  booked_it_config,
  menu_config,
  pay_now_config,
  review_config,
  promo_config
)
values (
  '00000000-0000-0000-0000-000000000001',
  true,
  '{
    "autoReadChatContext": true,
    "defaultCurrency": "ZAR",
    "invoiceNumberPrefix": "INV-2026-",
    "nextInvoiceSequence": 1,
    "paymentTerms": "Due within 7 days",
    "defaultVatPercent": 15
  }'::jsonb,
  '{
    "isConfigured": true,
    "weeklyAvailability": {
      "monday":    {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "tuesday":   {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "wednesday": {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "thursday":  {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "friday":    {"enabled": true,  "startTime": "09:00", "endTime": "17:00"},
      "saturday":  {"enabled": true,  "startTime": "09:00", "endTime": "13:00"},
      "sunday":    {"enabled": false, "startTime": null,    "endTime": null}
    },
    "appointmentTypes": [
      {"id": "diag",  "name": "Full Diagnostic Scan", "durationMinutes": 45, "price": 750},
      {"id": "cons",  "name": "Basic Consultation",    "durationMinutes": 30, "price": 450},
      {"id": "style", "name": "Hair Styling Session",  "durationMinutes": 60, "price": 350}
    ],
    "bufferMinutes": 15,
    "maxBookingsPerDay": 12,
    "calendarSync": {
      "provider": "google",
      "connected": false,
      "refreshTokenRef": null,
      "calendarId": null
    }
  }'::jsonb,
  '{
    "isConfigured": true,
    "mediaLibraryBucket": "inflow-media",
    "defaultIntroMessage": "Here'\''s our latest price list! 📋"
  }'::jsonb,
  '{
    "isConfigured": false,
    "payoutProvider": null,
    "subAccountId": null,
    "acceptedMethods": ["Card", "Instant EFT", "Capitec Pay", "SnapScan"]
  }'::jsonb,
  '{
    "googleReviewUrl": null,
    "autoPromptOnPaymentSuccess": true,
    "defaultTemplateId": "standard"
  }'::jsonb,
  '{
    "defaultExpiryDays": 7,
    "staleThreadDays": 3
  }'::jsonb
)
on conflict (business_id) do nothing;

-- ───────────────────────────────────────────────────────────────────────
-- 2. inflow_items_catalog — realistic SA small-business defaults
-- ───────────────────────────────────────────────────────────────────────
-- Mixed automotive + hair/beauty since the demo business spans both
-- categories, mirroring the kind of multi-service SME inFlow targets.

insert into inflow_items_catalog
  (business_id, kind, name, description, price, currency, duration_minutes, is_active, sort_order)
values
  ('00000000-0000-0000-0000-000000000001', 'service', 'Basic Consultation',          'Initial assessment and advice session.',                 450.00, 'ZAR', 30, true, 1),
  ('00000000-0000-0000-0000-000000000001', 'service', 'Full Diagnostic Scan',        'Complete vehicle diagnostic check using OBD scanner.',    750.00, 'ZAR', 45, true, 2),
  ('00000000-0000-0000-0000-000000000001', 'service', 'Brake Pad Replacement',       'Front or rear brake pad replacement, parts + labour.',    650.00, 'ZAR', 60, true, 3),
  ('00000000-0000-0000-0000-000000000001', 'service', 'Oil & Filter Change',         'Full synthetic oil change with new filter.',              480.00, 'ZAR', 30, true, 4),
  ('00000000-0000-0000-0000-000000000001', 'service', 'Wheel Alignment',             'Computerised 4-wheel alignment.',                          350.00, 'ZAR', 40, true, 5),
  ('00000000-0000-0000-0000-000000000001', 'service', 'Hair Braiding (Full Head)',   'Box braids or cornrows, full head.',                       450.00, 'ZAR', 120, true, 6),
  ('00000000-0000-0000-0000-000000000001', 'service', 'Hair Styling Session',        'Wash, blow-dry, and style.',                               350.00, 'ZAR', 60, true, 7),
  ('00000000-0000-0000-0000-000000000001', 'product', 'Premium Styling Gel',         'Strong-hold styling gel, 250ml.',                          120.00, 'ZAR', null, true, 8),
  ('00000000-0000-0000-0000-000000000001', 'product', 'Argan Oil Hair Treatment',    'Deep-conditioning argan oil treatment, 100ml.',            180.00, 'ZAR', null, true, 9),
  ('00000000-0000-0000-0000-000000000001', 'service', 'Manicure & Polish',           'Classic manicure with gel polish finish.',                 220.00, 'ZAR', 45, true, 10)
on conflict do nothing;

-- ───────────────────────────────────────────────────────────────────────
-- 3. inflow_vouchers — sample promo presets
-- ───────────────────────────────────────────────────────────────────────

insert into inflow_vouchers
  (business_id, code, discount_label, discount_type, discount_value, expires_at, is_active)
values
  ('00000000-0000-0000-0000-000000000001', 'WINTER10', '10% off',          'percentage',   10,  now() + interval '30 days', true),
  ('00000000-0000-0000-0000-000000000001', 'COMEBACK10', '10% off',        'percentage',   10,  now() + interval '14 days', true),
  ('00000000-0000-0000-0000-000000000001', 'FREEDEL',  'Free delivery',   'free_item',     null, now() + interval '7 days',  true)
on conflict (business_id, code) do nothing;

-- ───────────────────────────────────────────────────────────────────────
-- 4. inflow_media_assets — sample menu/price-list placeholder
-- ───────────────────────────────────────────────────────────────────────

insert into inflow_media_assets (business_id, label, file_url, file_type)
values
  ('00000000-0000-0000-0000-000000000001', 'Winter Price List 2026', 'https://placeholder.inflow.to/winter-pricelist-2026.pdf', 'pdf')
on conflict do nothing;
