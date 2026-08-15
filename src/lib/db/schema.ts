// Drizzle schema — mirrors supabase/migrations/0001_init.sql (source of truth).
// Used for typed reads/writes only. Do NOT run drizzle-kit push against this
// (it would try to drop/recreate the SQL-managed tables).

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  date,
  primaryKey,
} from "drizzle-orm/pg-core";

export const bookingStatus = pgEnum("booking_status", [
  "new",
  "contacted",
  "confirmed",
  "cancelled",
  "completed",
]);

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  brand: text("brand").notNull().default("Anchor Eco Resort & Spa"),
  taglineEn: text("tagline_en").default(""),
  taglineBn: text("tagline_bn").default(""),
  heroTitleEn: text("hero_title_en").default(""),
  heroTitleBn: text("hero_title_bn").default(""),
  heroSubtitleEn: text("hero_subtitle_en").default(""),
  heroSubtitleBn: text("hero_subtitle_bn").default(""),
  aboutEn: text("about_en").default(""),
  aboutBn: text("about_bn").default(""),
  heroImage: text("hero_image").default(""),
  phone1: text("phone1").default(""),
  phone2: text("phone2").default(""),
  phone3: text("phone3").default(""),
  whatsapp: text("whatsapp").default(""),
  email: text("email").default(""),
  addressEn: text("address_en").default(""),
  addressBn: text("address_bn").default(""),
  mapLat: numeric("map_lat"),
  mapLng: numeric("map_lng"),
  facebook: text("facebook").default(""),
  instagram: text("instagram").default(""),
  youtube: text("youtube").default(""),
  checkIn: text("check_in").default(""),
  checkOut: text("check_out").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull().default(""),
  nameBn: text("name_bn").notNull().default(""),
  shortEn: text("short_en").default(""),
  shortBn: text("short_bn").default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionBn: text("description_bn").notNull().default(""),
  view: text("view").notNull().default(""),
  weekdayRate: integer("weekday_rate").notNull().default(0),
  weekendRate: integer("weekend_rate").notNull().default(0),
  occupancy: integer("occupancy").notNull().default(2),
  size: text("size").default(""),
  images: text("images").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const amenities = pgTable("amenities", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameEn: text("name_en").notNull().default(""),
  nameBn: text("name_bn").notNull().default(""),
  noteEn: text("note_en").default(""),
  noteBn: text("note_bn").default(""),
  icon: text("icon").default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const roomAmenities = pgTable(
  "room_amenities",
  {
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    amenityId: uuid("amenity_id")
      .notNull()
      .references(() => amenities.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.roomId, t.amenityId] })],
);

export const offers = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull().default(""),
  titleBn: text("title_bn").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionBn: text("description_bn").notNull().default(""),
  badgeEn: text("badge_en").default(""),
  badgeBn: text("badge_bn").default(""),
  price: text("price").default(""),
  image: text("image").default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  category: text("category").notNull().default("pool"),
  captionEn: text("caption_en").default(""),
  captionBn: text("caption_bn").default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  author: text("author").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  bodyEn: text("body_en").notNull().default(""),
  bodyBn: text("body_bn").notNull().default(""),
  source: text("source").default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "set null" }),
  roomSlug: text("room_slug").default(""),
  checkIn: date("check_in"),
  checkOut: date("check_out"),
  adults: integer("adults").default(1),
  children: integer("children").default(0),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").default(""),
  message: text("message").default(""),
  source: text("source").notNull().default("booking"),
  status: bookingStatus("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const admins = pgTable("admins", {
  userId: uuid("user_id").primaryKey(),
  email: text("email").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type Room = typeof rooms.$inferSelect;
export type Amenity = typeof amenities.$inferSelect;
export type Offer = typeof offers.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type BookingStatus = (typeof bookingStatus.enumValues)[number];
