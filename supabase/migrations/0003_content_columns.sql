-- Phase 2.5: columns needed to hold the real content pack.
alter table public.site_settings
  add column if not exists about_en   text default '',
  add column if not exists about_bn   text default '',
  add column if not exists hero_image text default '';

alter table public.rooms
  add column if not exists short_en text default '',
  add column if not exists short_bn text default '';

alter table public.amenities
  add column if not exists note_en text default '',
  add column if not exists note_bn text default '';
