// inFlow — Core TypeScript Interfaces
// Path: lib/inflow-types.ts  (sibling to lib/supabase.ts, lib/auth.ts, etc.)
//
// IMPORTANT: This file extends/complements the existing `lib/supabase.ts`
// types (Chat, Message, Business) — it does NOT redefine them. Those three
// types are the source of truth for the chat/business layer and already
// have live components built against them (FastInvoice, BookedIt,
// QuoteCraft, MenuDrop, PinTracker, PayNow, ReviewLink, PromoBlast).
//
// Reality check against lib/supabase.ts:
//   - Chat has NO customer_name/customer_phone/channel fields today.
//     Plugins currently only use `chat.id`. The new tables below
//     (inflow_bookings, inflow_invoices, etc.) store customer_name/phone
//     themselves rather than assuming Chat will carry them — so nothing
//     breaks if Chat's shape is widened later, and nothing here REQUIRES
//     that widening to compile.
//   - Business uses `business_name` (not `name`), has `categories: string[]`,
//     `address`, `email`, and WhatsApp fields flattened directly onto the
//     row (whatsapp_number, whatsapp_waba_id, etc). No `logo_url`,
//     `google_review_url`, `currency`, or `timezone` exist on it yet.
//     Those are genuinely new concepts this spec introduces, so per the
//     architectural requirement ("do NOT bundle plugin configurations
//     directly into the main businesses table"), they live in
//     `inflow_plugin_configurations` / dedicated columns below, NOT
//     bolted onto `businesses`.
// ════════════════════════════════════════════════════════════════════════

import type { Chat, Message, Business } from '@/lib/supabase';

// Re-export so consumers can import everything from one place if desired
export type { Chat, Message, Business };

// ───────────────────────────────────────────────────────────────────────
// 1. PLUGIN CONFIGURATIONS (inflow_plugin_configurations)
// ───────────────────────────────────────────────────────────────────────
// One row per business. Each native tool gets its own JSONB column so
// configs stay independently editable without ALTERing the table every
// time a tool's config shape changes.

export interface InvoiceQuoteConfig {
  autoReadChatContext: boolean; // toggle: pre-fill from AI extraction. If off, modal opens blank.
  defaultCurrency: string; // "ZAR"
  invoiceNumberPrefix: string; // e.g. "INV-2026-"
  nextInvoiceSequence: number;
  paymentTerms: string | null; // e.g. "Due within 7 days"
  defaultVatPercent: number; // 15 for South Africa
}

export interface WeeklyAvailabilityMatrix {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface DayAvailability {
  enabled: boolean;
  startTime: string | null; // "09:00"
  endTime: string | null; // "17:00"
}

export interface AppointmentType {
  id: string;
  name: string; // "Basic Consultation"
  durationMinutes: number;
  price: number | null;
}

export interface BookedItConfig {
  isConfigured: boolean; // locked until weeklyAvailability + calendar set
  weeklyAvailability: WeeklyAvailabilityMatrix;
  appointmentTypes: AppointmentType[];
  bufferMinutes: number; // gap between bookings
  maxBookingsPerDay: number | null; // null = unlimited
  calendarSync: {
    provider: 'google' | 'outlook' | null;
    connected: boolean;
    refreshTokenRef: string | null; // pointer to encrypted secret, never the raw token
    calendarId: string | null;
  };
}

export interface MenuConfig {
  isConfigured: boolean;
  mediaLibraryBucket: string; // Supabase storage bucket name
  defaultIntroMessage: string;
}

export interface PayNowConfig {
  isConfigured: boolean; // locked until payout linked
  payoutProvider: 'payfast' | 'yoco' | null;
  subAccountId: string | null;
  acceptedMethods: string[]; // ["Card", "Instant EFT", "Capitec Pay", "SnapScan"]
}

export interface ReviewConfig {
  googleReviewUrl: string | null;
  autoPromptOnPaymentSuccess: boolean;
  defaultTemplateId: 'standard' | 'warm' | 'brief';
}

export interface PromoConfig {
  defaultExpiryDays: number;
  staleThreadDays: number; // how many days of silence triggers a "re-engage" suggestion
}

export interface InflowPluginConfigurations {
  id: string;
  business_id: string;
  auto_read_chat_context: boolean; // master toggle for the AI extractor across all tools
  invoice_quote_config: InvoiceQuoteConfig;
  booked_it_config: BookedItConfig;
  menu_config: MenuConfig;
  pay_now_config: PayNowConfig;
  review_config: ReviewConfig;
  promo_config: PromoConfig;
  created_at: string;
  updated_at: string;
}

// ───────────────────────────────────────────────────────────────────────
// 2. ITEMS CATALOG (inflow_items_catalog)
// ───────────────────────────────────────────────────────────────────────

export type CatalogItemKind = 'service' | 'product' | 'menu_item';

export interface InflowCatalogItem {
  id: string;
  business_id: string;
  kind: CatalogItemKind;
  name: string;
  description: string | null;
  price: number; // ZAR, decimal
  currency: string; // "ZAR"
  duration_minutes: number | null; // relevant for services
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ───────────────────────────────────────────────────────────────────────
// 3. BOOKINGS / CALENDAR LEDGER (inflow_bookings)
// ───────────────────────────────────────────────────────────────────────
// Stores customer_name/phone itself since the base `Chat` type does not
// carry those fields today.

export interface InflowBooking {
  id: string;
  business_id: string;
  chat_id: string | null; // FK -> chats.id
  appointment_type_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  booking_date: string; // ISO YYYY-MM-DD
  start_time: string; // "14:00"
  end_time: string; // "14:45"
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  source: 'manual_override' | 'public_link';
  public_booking_token: string | null; // for inflow.to/book/[token]
  created_at: string;
  updated_at: string;
}

// ───────────────────────────────────────────────────────────────────────
// 4. INVOICES / QUOTES (inflow_invoices)
// ───────────────────────────────────────────────────────────────────────

export interface InflowLineItem {
  catalogItemId: string | null; // null if manually added, not pulled from catalog
  item: string;
  description: string | null;
  price: number;
  quantity: number;
}

export interface InflowInvoice {
  id: string;
  business_id: string;
  chat_id: string | null;
  type: 'invoice' | 'quote';
  reference: string; // "INV-2026-001"
  customer_name: string | null;
  customer_phone: string | null;
  line_items: InflowLineItem[];
  subtotal: number;
  vat_amount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_intent_id: string | null; // FK -> inflow_payment_intents
  created_at: string;
  updated_at: string;
}

// ───────────────────────────────────────────────────────────────────────
// 5. PAYMENTS (inflow_payment_intents)
// ───────────────────────────────────────────────────────────────────────

export interface InflowPaymentIntent {
  id: string;
  business_id: string;
  invoice_id: string | null;
  amount: number;
  currency: string;
  short_link_token: string; // the "intent_id" used in inflow.to/pay/[intent_id]
  provider: 'payfast' | 'yoco';
  provider_reference: string | null;
  status: 'pending' | 'success' | 'failed' | 'expired';
  created_at: string;
  updated_at: string;
}

// ───────────────────────────────────────────────────────────────────────
// 6. PROMO / VOUCHERS (inflow_vouchers)
// ───────────────────────────────────────────────────────────────────────

export interface InflowVoucher {
  id: string;
  business_id: string;
  code: string;
  discount_label: string; // "10% off", "Free delivery"
  discount_type: 'percentage' | 'fixed_amount' | 'free_item' | 'other';
  discount_value: number | null;
  flyer_media_url: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

// ───────────────────────────────────────────────────────────────────────
// 7. MEDIA LIBRARY (inflow_media_assets) — Menu plugin uploads
// ───────────────────────────────────────────────────────────────────────

export interface InflowMediaAsset {
  id: string;
  business_id: string;
  label: string; // "Winter Menu 2026"
  file_url: string;
  file_type: 'pdf' | 'jpg' | 'png';
  created_at: string;
}

// ───────────────────────────────────────────────────────────────────────
// 8. AI CONTEXT EXTRACTION (Gemini 2.5 Flash on-demand)
// ───────────────────────────────────────────────────────────────────────

export interface AIContextExtraction {
  detectedIntent: 'invoice' | 'booking' | 'quote' | 'promo' | 'none';
  customerInfo: {
    name: string | null;
    phone: string | null;
  };
  invoiceDetails: {
    lineItems: Array<{ item: string; price: number; quantity: number }>;
    currency: string; // Default to "ZAR"
  };
  bookingDetails: {
    requestedDate: string | null; // ISO YYYY-MM-DD string if inferred
    requestedTimeSlot: string | null; // e.g., "afternoon", "14:00"
    serviceType: string | null;
  };
}

export interface AIExtractRequestBody {
  chatId: string;
  businessId: string;
}

export interface AIExtractResponse {
  extraction: AIContextExtraction;
  matchedCatalogItems: InflowCatalogItem[]; // cross-referenced against the business's catalog
}
