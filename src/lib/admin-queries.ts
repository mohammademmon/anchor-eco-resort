import { asc, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  rooms,
  amenities,
  offers,
  galleryImages,
  reviews,
  bookings,
  siteSettings,
  roomAmenities,
} from "@/lib/db/schema";

// Admin reads — all rows (published and unpublished). Server-only.

export async function getAllRooms() {
  return db.select().from(rooms).orderBy(asc(rooms.sortOrder));
}

export async function getAllAmenities() {
  return db.select().from(amenities).orderBy(asc(amenities.sortOrder));
}

export async function getAllOffers() {
  return db.select().from(offers).orderBy(asc(offers.sortOrder));
}

export async function getAllGallery() {
  return db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder));
}

export async function getAllReviews() {
  return db.select().from(reviews).orderBy(asc(reviews.sortOrder));
}

export async function getAllBookings() {
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function getSettingsRow() {
  const rows = await db.select().from(siteSettings).limit(1);
  return rows[0] ?? null;
}

export async function getRoomAmenityMap(): Promise<Record<string, string[]>> {
  const rows = await db.select().from(roomAmenities);
  const map: Record<string, string[]> = {};
  for (const r of rows) {
    (map[r.roomId] ??= []).push(r.amenityId);
  }
  return map;
}
