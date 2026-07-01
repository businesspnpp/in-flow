-- Inbox sync support for Zernio inbound webhooks.

alter table public.chats
  add column if not exists channel text;

alter table public.messages
  add column if not exists channel text;

create index if not exists chats_channel_idx
  on public.chats using btree (channel);

create index if not exists messages_channel_idx
  on public.messages using btree (channel);

alter table public.chats
  drop constraint if exists chats_channel_check;

alter table public.chats
  add constraint chats_channel_check
  check (channel is null or channel in ('whatsapp', 'facebook', 'instagram', 'tiktok', 'telegram', 'sms', 'email'));

alter table public.messages
  drop constraint if exists messages_channel_check;

alter table public.messages
  add constraint messages_channel_check
  check (channel is null or channel in ('whatsapp', 'facebook', 'instagram', 'tiktok', 'telegram', 'sms', 'email'));

update public.chats
set channel = case
  when id like 'whatsapp:%' then 'whatsapp'
  when id like 'facebook:%' then 'facebook'
  when id like 'instagram:%' then 'instagram'
  when id like 'tiktok:%' then 'tiktok'
  when id like 'telegram:%' then 'telegram'
  when id like 'sms:%' then 'sms'
  when id like 'email:%' then 'email'
  else channel
end
where channel is null;

update public.messages m
set channel = c.channel
from public.chats c
where m.chat_id = c.id
  and m.channel is null;

create table if not exists public.zernio_webhook_events (
  event_id text primary key,
  business_id uuid not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists zernio_webhook_events_business_idx
  on public.zernio_webhook_events using btree (business_id, received_at desc);
