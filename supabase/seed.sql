-- Phase 2 seed data (EN now; BN filled later via the CMS).

-- Site settings (singleton)
insert into public.site_settings
  (id, brand, tagline_en, hero_title_en, hero_subtitle_en,
   phone1, phone2, phone3, whatsapp, email,
   address_en, map_lat, map_lng, facebook, check_in, check_out)
values
  (1, 'Anchor Eco Resort & Spa',
   'An eco-luxe retreat by the sea.',
   'Anchor Eco Resort & Spa',
   'A calm, natural escape at Inani Beach, Cox''s Bazar.',
   '01897629200', '01897629191', '01799579049', '8801897629200', '',
   'Inani Beach, Ukhia, Cox''s Bazar 4750', 21.2510, 92.0430,
   'https://www.facebook.com/p/Anchor-Eco-Resort-Spa-61555496545942/',
   '2:00 PM', '12:00 PM')
on conflict (id) do update set
  brand = excluded.brand,
  tagline_en = excluded.tagline_en,
  hero_title_en = excluded.hero_title_en,
  hero_subtitle_en = excluded.hero_subtitle_en,
  phone1 = excluded.phone1, phone2 = excluded.phone2, phone3 = excluded.phone3,
  whatsapp = excluded.whatsapp,
  address_en = excluded.address_en,
  map_lat = excluded.map_lat, map_lng = excluded.map_lng,
  facebook = excluded.facebook,
  check_in = excluded.check_in, check_out = excluded.check_out;

-- Rooms
insert into public.rooms
  (slug, name_en, description_en, view, weekday_rate, weekend_rate,
   occupancy, featured, published, sort_order)
values
  ('super-deluxe-hill-side', 'Super Deluxe Hill Side',
   'Placeholder description — hill-side super deluxe room.', 'hill', 4800, 5600, 2, true, true, 1),
  ('super-deluxe-sea-view', 'Super Deluxe Sea View',
   'Placeholder description — sea-view super deluxe room.', 'sea', 5400, 6300, 2, true, true, 2),
  ('premium-executive-cottage', 'Premium Executive Cottage',
   'Placeholder description — premium executive cottage.', 'cottage', 6000, 7000, 3, true, true, 3),
  ('premium-deluxe-sea-view', 'Premium Deluxe Sea View',
   'Placeholder description — premium deluxe sea-view room.', 'sea', 4800, 5600, 2, true, true, 4)
on conflict (slug) do update set
  name_en = excluded.name_en,
  description_en = excluded.description_en,
  view = excluded.view,
  weekday_rate = excluded.weekday_rate,
  weekend_rate = excluded.weekend_rate,
  occupancy = excluded.occupancy,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;

-- Amenities (idempotent by name_en)
insert into public.amenities (name_en, sort_order, published)
select v.name_en, v.sort_order, true
from (values
  ('Infinity Pool', 1),
  ('Ocean Kitchen Restaurant', 2),
  ('Free Wi-Fi', 3),
  ('Spa', 4),
  ('Beachfront Access', 5),
  ('Landscaped Gardens', 6),
  ('Welcome Drinks', 7),
  ('Bottled Water', 8)
) as v(name_en, sort_order)
where not exists (
  select 1 from public.amenities a where a.name_en = v.name_en
);

-- Reviews (idempotent by author)
insert into public.reviews (author, rating, body_en, source, sort_order, published)
select v.author, 5, v.body_en, 'Placeholder', v.sort_order, true
from (values
  ('Guest One', 'Placeholder five-star review one. Replace with a real Facebook review.', 1),
  ('Guest Two', 'Placeholder five-star review two. Replace with a real Facebook review.', 2),
  ('Guest Three', 'Placeholder five-star review three. Replace with a real Facebook review.', 3)
) as v(author, body_en, sort_order)
where not exists (
  select 1 from public.reviews r where r.author = v.author
);
