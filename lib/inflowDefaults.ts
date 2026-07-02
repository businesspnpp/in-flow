// inFlow — Hardcoded TypeScript Fallback Dataset
// Path: lib/inflowDefaults.ts  (sibling to lib/inflow-types.ts)
//
// Used when:
//   - Supabase isn't configured yet (local dev without env vars)
//   - A business hasn't run the seed script
//   - Storybook / component tests need deterministic data
//
// Shapes match types/inflow.ts exactly. Import and slice from these
// rather than duplicating literals across components.
// ════════════════════════════════════════════════════════════════════════

import type {
  InflowCatalogItem,
  InflowPluginConfigurations,
  InflowVoucher,
  InflowMediaAsset,
  BookedItConfig,
} from './inflow-types';

export const MOCK_BUSINESS_ID = '00000000-0000-0000-0000-000000000001';

// ───────────────────────────────────────────────────────────────────────
// Catalog — realistic South African small-business defaults
// ───────────────────────────────────────────────────────────────────────

export const DEFAULT_CATALOG_ITEMS: InflowCatalogItem[] = [
  {
    id: 'cat_001',
    business_id: MOCK_BUSINESS_ID,
    kind: 'service',
    name: 'Basic Consultation',
    description: 'Initial assessment and advice session.',
    price: 450,
    currency: 'ZAR',
    duration_minutes: 30,
    is_active: true,
    sort_order: 1,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cat_002',
    business_id: MOCK_BUSINESS_ID,
    kind: 'service',
    name: 'Full Diagnostic Scan',
    description: 'Complete vehicle diagnostic check using OBD scanner.',
    price: 750,
    currency: 'ZAR',
    duration_minutes: 45,
    is_active: true,
    sort_order: 2,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cat_003',
    business_id: MOCK_BUSINESS_ID,
    kind: 'service',
    name: 'Brake Pad Replacement',
    description: 'Front or rear brake pad replacement, parts + labour.',
    price: 650,
    currency: 'ZAR',
    duration_minutes: 60,
    is_active: true,
    sort_order: 3,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cat_004',
    business_id: MOCK_BUSINESS_ID,
    kind: 'service',
    name: 'Oil & Filter Change',
    description: 'Full synthetic oil change with new filter.',
    price: 480,
    currency: 'ZAR',
    duration_minutes: 30,
    is_active: true,
    sort_order: 4,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cat_005',
    business_id: MOCK_BUSINESS_ID,
    kind: 'service',
    name: 'Wheel Alignment',
    description: 'Computerised 4-wheel alignment.',
    price: 350,
    currency: 'ZAR',
    duration_minutes: 40,
    is_active: true,
    sort_order: 5,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cat_006',
    business_id: MOCK_BUSINESS_ID,
    kind: 'service',
    name: 'Hair Braiding (Full Head)',
    description: 'Box braids or cornrows, full head.',
    price: 450,
    currency: 'ZAR',
    duration_minutes: 120,
    is_active: true,
    sort_order: 6,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cat_007',
    business_id: MOCK_BUSINESS_ID,
    kind: 'service',
    name: 'Hair Styling Session',
    description: 'Wash, blow-dry, and style.',
    price: 350,
    currency: 'ZAR',
    duration_minutes: 60,
    is_active: true,
    sort_order: 7,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cat_008',
    business_id: MOCK_BUSINESS_ID,
    kind: 'product',
    name: 'Premium Styling Gel',
    description: 'Strong-hold styling gel, 250ml.',
    price: 120,
    currency: 'ZAR',
    duration_minutes: null,
    is_active: true,
    sort_order: 8,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cat_009',
    business_id: MOCK_BUSINESS_ID,
    kind: 'product',
    name: 'Argan Oil Hair Treatment',
    description: 'Deep-conditioning argan oil treatment, 100ml.',
    price: 180,
    currency: 'ZAR',
    duration_minutes: null,
    is_active: true,
    sort_order: 9,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cat_010',
    business_id: MOCK_BUSINESS_ID,
    kind: 'service',
    name: 'Manicure & Polish',
    description: 'Classic manicure with gel polish finish.',
    price: 220,
    currency: 'ZAR',
    duration_minutes: 45,
    is_active: true,
    sort_order: 10,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Default weekly availability (used by BookedIt mock pre-set)
// ───────────────────────────────────────────────────────────────────────

export const DEFAULT_WEEKLY_AVAILABILITY: BookedItConfig['weeklyAvailability'] = {
  monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
  tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
  wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
  thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
  friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
  saturday: { enabled: true, startTime: '09:00', endTime: '13:00' },
  sunday: { enabled: false, startTime: null, endTime: null },
};

// ───────────────────────────────────────────────────────────────────────
// Baseline plugin configuration state (mirrors seed.sql defaults)
// ───────────────────────────────────────────────────────────────────────

export const DEFAULT_PLUGIN_CONFIGURATIONS: InflowPluginConfigurations = {
  id: 'cfg_001',
  business_id: MOCK_BUSINESS_ID,
  auto_read_chat_context: true,

  invoice_quote_config: {
    autoReadChatContext: true,
    defaultCurrency: 'ZAR',
    invoiceNumberPrefix: 'INV-2026-',
    nextInvoiceSequence: 1,
    paymentTerms: 'Due within 7 days',
    defaultVatPercent: 15,
  },

  booked_it_config: {
    isConfigured: true, // mock pre-set: unlocked for testing, see spec note below
    weeklyAvailability: DEFAULT_WEEKLY_AVAILABILITY,
    appointmentTypes: [
      { id: 'diag', name: 'Full Diagnostic Scan', durationMinutes: 45, price: 750 },
      { id: 'cons', name: 'Basic Consultation', durationMinutes: 30, price: 450 },
      { id: 'style', name: 'Hair Styling Session', durationMinutes: 60, price: 350 },
    ],
    bufferMinutes: 15,
    maxBookingsPerDay: 12,
    calendarSync: {
      provider: 'google',
      connected: false, // OAuth not yet completed — still requires real connection for live sync
      refreshTokenRef: null,
      calendarId: null,
    },
  },

  menu_config: {
    isConfigured: true,
    mediaLibraryBucket: 'inflow-media',
    defaultIntroMessage: "Here's our latest price list! 📋",
  },

  pay_now_config: {
    isConfigured: false, // locked until bank/payout linked — per spec
    payoutProvider: null,
    subAccountId: null,
    acceptedMethods: ['Card', 'Instant EFT', 'Capitec Pay', 'SnapScan'],
  },

  review_config: {
    googleReviewUrl: null, // ready-to-use with generic inFlow feedback collector until set
    autoPromptOnPaymentSuccess: true,
    defaultTemplateId: 'standard',
  },

  promo_config: {
    defaultExpiryDays: 7,
    staleThreadDays: 3,
  },

  created_at: '2026-01-01T08:00:00.000Z',
  updated_at: '2026-01-01T08:00:00.000Z',
};

// ───────────────────────────────────────────────────────────────────────
// Default vouchers (Promo tool presets)
// ───────────────────────────────────────────────────────────────────────

export const DEFAULT_VOUCHERS: InflowVoucher[] = [
  {
    id: 'vch_001',
    business_id: MOCK_BUSINESS_ID,
    code: 'WINTER10',
    discount_label: '10% off',
    discount_type: 'percentage',
    discount_value: 10,
    flyer_media_url: null,
    expires_at: '2026-07-25T00:00:00.000Z',
    is_active: true,
    created_at: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'vch_002',
    business_id: MOCK_BUSINESS_ID,
    code: 'COMEBACK10',
    discount_label: '10% off',
    discount_type: 'percentage',
    discount_value: 10,
    flyer_media_url: null,
    expires_at: '2026-07-09T00:00:00.000Z',
    is_active: true,
    created_at: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'vch_003',
    business_id: MOCK_BUSINESS_ID,
    code: 'FREEDEL',
    discount_label: 'Free delivery',
    discount_type: 'free_item',
    discount_value: null,
    flyer_media_url: null,
    expires_at: '2026-07-02T00:00:00.000Z',
    is_active: true,
    created_at: '2026-06-01T08:00:00.000Z',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Default media assets (Menu tool placeholder asset)
// ───────────────────────────────────────────────────────────────────────

export const DEFAULT_MEDIA_ASSETS: InflowMediaAsset[] = [
  {
    id: 'med_001',
    business_id: MOCK_BUSINESS_ID,
    label: 'Winter Price List 2026',
    file_url: 'https://placeholder.inflow.to/winter-pricelist-2026.pdf',
    file_type: 'pdf',
    created_at: '2026-06-01T08:00:00.000Z',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Helper: get the full fallback bundle in one call
// ───────────────────────────────────────────────────────────────────────

export function getInflowFallbackData() {
  return {
    catalogItems: DEFAULT_CATALOG_ITEMS,
    pluginConfigurations: DEFAULT_PLUGIN_CONFIGURATIONS,
    vouchers: DEFAULT_VOUCHERS,
    mediaAssets: DEFAULT_MEDIA_ASSETS,
  };
      }
