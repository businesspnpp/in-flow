-- Add logo URL field for business profile images

alter table public.businesses
  add column if not exists logo_url text;
