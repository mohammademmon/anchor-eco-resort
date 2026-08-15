import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  rooms,
  amenities,
  offers,
  galleryImages,
  reviews,
  siteSettings,
  roomAmenities,
} from "@/lib/db/schema";

// Public (published-only) reads via Drizzle. Server-only.

// Wrap a query so a DB hiccup (or missing env at build) degrades gracefully
// instead of throwing the whole page.
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[query]", (err as Error).message);
    return fallback;
  }
}

export async function getSettings() {
  const rows = await db.select().from(siteSettings).limit(1);
  return rows[0] ?? null;
}

export async function getPublishedRooms() {
  return db
    .select()
    .from(rooms)
    .where(eq(rooms.published, true))
    .orderBy(asc(rooms.sortOrder));
}

export async function getFeaturedRooms() {
  return db
    .select()
    .from(rooms)
    .where(and(eq(rooms.published, true), eq(rooms.featured, true)))
    .orderBy(asc(rooms.sortOrder));
}

export async function getRoomBySlug(slug: string) {
  const rows = await db
    .select()
    .from(rooms)
    .where(and(eq(rooms.slug, slug), eq(rooms.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAmenitiesForRoom(roomId: string) {
  return db
    .select({
      id: amenities.id,
      nameEn: amenities.nameEn,
      nameBn: amenities.nameBn,
      noteEn: amenities.noteEn,
      noteBn: amenities.noteBn,
    })
    .from(roomAmenities)
    .innerJoin(amenities, eq(roomAmenities.amenityId, amenities.id))
    .where(and(eq(roomAmenities.roomId, roomId), eq(amenities.published, true)))
    .orderBy(asc(amenities.sortOrder));
}

export async function getPublishedAmenities() {
  return db
    .select()
    .from(amenities)
    .where(eq(amenities.published, true))
    .orderBy(asc(amenities.sortOrder));
}

export async function getPublishedOffers() {
  return db
    .select()
    .from(offers)
    .where(eq(offers.published, true))
    .orderBy(asc(offers.sortOrder));
}

export async function getPublishedGallery() {
  return db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.published, true))
    .orderBy(asc(galleryImages.sortOrder));
}

export async function getPublishedReviews() {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.published, true))
    .orderBy(asc(reviews.sortOrder));
}
