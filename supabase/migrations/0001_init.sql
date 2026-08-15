-- Anchor Eco Resort & Spa — Phase 2 initial schema
-- Source of truth for the database. Drizzle mirrors these tables for typed
-- queries only; drizzle-kit must NOT drop/recreate them.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type booking_status as enum (
    'new', 'contacted', 'confirmed', 'cancelled', 'completed'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Singleton site settings (id is always 1).
create table if not exists public.site_settings (
  id            integer primary key default 1 check (id = 1),
  brand         text not null default 'Anchor Eco Resort & Spa',
  tagline_en    text default '',
  tagline_bn    text default '',
  hero_title_en text default '',
  hero_title_bn text default '',
  hero_subtitle_en text default '',
  hero_subtitle_bn text default '',
  phone1        text default '',
  phone2        text default '',
  phone3        text default '',
  whatsapp      text default '',
  email         text default '',
  address_en    text default '',
  address_bn    text default '',
  map_lat       numeric,
  map_lng       numeric,
  facebook      text default '',
  instagram     text default '',
  youtube       text default '',
  check_in      text default '',
  check_out     text default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.rooms (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name_en        text not null default '',
  name_bn        text not null default '',
  description_en text not null default '',
  description_bn text not null default '',
  view           text not null default '',
  weekday_rate   integer not null default 0,
  weekend_rate   integer not null default 0,
  occupancy      integer not null default 2,
  size           text default '',
  images         text[] not null default '{}',
  featured       boolean not null default false,
  published      boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.amenities (
  id         uuid primary key default gen_random_uuid(),
  name_en    text not null default '',
  name_bn    text not null default '',
  icon       text default '',
  published  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_amenities (
  room_id    uuid not null references public.rooms(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete cascade,
  primary key (room_id, amenity_id)
);

create table if not exists public.offers (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title_en       text not null default '',
  title_bn       text not null default '',
  description_en text not null default '',
  description_bn text not null default '',
  badge_en       text default '',
  badge_bn       text default '',
  price          text default '',
  image          text default '',
  published      boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  category   text not null default 'pool',
  caption_en text default '',
  caption_bn text default '',
  published  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  author     text not null default '',
  rating     integer not null default 5 check (rating between 1 and 5),
  body_en    text not null default '',
  body_bn    text not null default '',
  source     text default '',
  published  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid references public.rooms(id) on delete set null,
  room_slug  text default '',
  check_in   date,
  check_out  date,
  adults     integer default 1,
  children   integer default 0,
  name       text not null,
  phone      text not null,
  email      text default '',
  message    text default '',
  source     text not null default 'booking',
  status     booking_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','rooms','amenities','offers',
    'gallery_images','reviews','bookings'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Admin check
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.site_settings  enable row level security;
alter table public.rooms          enable row level security;
alter table public.amenities      enable row level security;
alter table public.room_amenities enable row level security;
alter table public.offers         enable row level security;
alter table public.gallery_images enable row level security;
alter table public.reviews        enable row level security;
alter table public.bookings       enable row level security;
alter table public.admins         enable row level security;

-- Public read of published content (admins see everything via is_admin()).
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select using (true);
drop policy if exists "settings admin all" on public.site_settings;
create policy "settings admin all" on public.site_settings
  for all using (is_admin()) with check (is_admin());

drop policy if exists "rooms public read" on public.rooms;
create policy "rooms public read" on public.rooms
  for select using (published = true or is_admin());
drop policy if exists "rooms admin all" on public.rooms;
create policy "rooms admin all" on public.rooms
  for all using (is_admin()) with check (is_admin());

drop policy if exists "amenities public read" on public.amenities;
create policy "amenities public read" on public.amenities
  for select using (published = true or is_admin());
drop policy if exists "amenities admin all" on public.amenities;
create policy "amenities admin all" on public.amenities
  for all using (is_admin()) with check (is_admin());

drop policy if exists "room_amenities public read" on public.room_amenities;
create policy "room_amenities public read" on public.room_amenities
  for select using (true);
drop policy if exists "room_amenities admin all" on public.room_amenities;
create policy "room_amenities admin all" on public.room_amenities
  for all using (is_admin()) with check (is_admin());

drop policy if exists "offers public read" on public.offers;
create policy "offers public read" on public.offers
  for select using (published = true or is_admin());
drop policy if exists "offers admin all" on public.offers;
create policy "offers admin all" on public.offers
  for all using (is_admin()) with check (is_admin());

drop policy if exists "gallery public read" on public.gallery_images;
create policy "gallery public read" on public.gallery_images
  for select using (published = true or is_admin());
drop policy if exists "gallery admin all" on public.gallery_images;
create policy "gallery admin all" on public.gallery_images
  for all using (is_admin()) with check (is_admin());

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews
  for select using (published = true or is_admin());
drop policy if exists "reviews admin all" on public.reviews;
create policy "reviews admin all" on public.reviews
  for all using (is_admin()) with check (is_admin());

-- Bookings: anyone may insert an inquiry; only admins may read/update/delete.
drop policy if exists "bookings anon insert" on public.bookings;
create policy "bookings anon insert" on public.bookings
  for insert to anon, authenticated with check (true);
drop policy if exists "bookings admin all" on public.bookings;
create policy "bookings admin all" on public.bookings
  for all using (is_admin()) with check (is_admin());

-- Admins table: only admins may read/manage.
drop policy if exists "admins admin all" on public.admins;
create policy "admins admin all" on public.admins
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Grants (RLS still governs row access)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on
  public.site_settings, public.rooms, public.amenities, public.room_amenities,
  public.offers, public.gallery_images, public.reviews
  to anon, authenticated;
grant insert on public.bookings to anon, authenticated;
