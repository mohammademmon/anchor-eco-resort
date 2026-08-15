"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  rooms,
  amenities,
  offers,
  galleryImages,
  reviews,
  siteSettings,
  bookings,
  roomAmenities,
} from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import {
  roomSchema,
  amenitySchema,
  offerSchema,
  gallerySchema,
  reviewSchema,
  settingsSchema,
  bookingStatusSchema,
  type RoomInput,
  type AmenityInput,
  type OfferInput,
  type GalleryInput,
  type ReviewInput,
  type SettingsInput,
} from "@/lib/validation";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

function fail(error: string): ActionResult {
  return { ok: false, error };
}

// --- Rooms ---------------------------------------------------------------
export async function upsertRoom(input: RoomInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const p = roomSchema.safeParse(input);
    if (!p.success) return fail(p.error.issues[0]?.message ?? "Invalid data");
    const v = p.data;
    const values = {
      slug: v.slug,
      nameEn: v.nameEn,
      nameBn: v.nameBn,
      descriptionEn: v.descriptionEn,
      descriptionBn: v.descriptionBn,
      view: v.view,
      weekdayRate: v.weekdayRate,
      weekendRate: v.weekendRate,
      occupancy: v.occupancy,
      size: v.size,
      images: v.images,
      featured: v.featured,
      published: v.published,
      sortOrder: v.sortOrder,
      updatedAt: new Date(),
    };
    if (v.id) {
      await db.update(rooms).set(values).where(eq(rooms.id, v.id));
      return { ok: true, id: v.id };
    }
    const [row] = await db.insert(rooms).values(values).returning({ id: rooms.id });
    return { ok: true, id: row.id };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function deleteRoom(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(rooms).where(eq(rooms.id, id));
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

// --- Amenities -----------------------------------------------------------
export async function upsertAmenity(input: AmenityInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const p = amenitySchema.safeParse(input);
    if (!p.success) return fail(p.error.issues[0]?.message ?? "Invalid data");
    const v = p.data;
    const values = {
      nameEn: v.nameEn,
      nameBn: v.nameBn,
      icon: v.icon,
      published: v.published,
      sortOrder: v.sortOrder,
      updatedAt: new Date(),
    };
    if (v.id) {
      await db.update(amenities).set(values).where(eq(amenities.id, v.id));
    } else {
      await db.insert(amenities).values(values);
    }
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function deleteAmenity(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(amenities).where(eq(amenities.id, id));
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

// --- Offers --------------------------------------------------------------
export async function upsertOffer(input: OfferInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const p = offerSchema.safeParse(input);
    if (!p.success) return fail(p.error.issues[0]?.message ?? "Invalid data");
    const v = p.data;
    const values = {
      slug: v.slug,
      titleEn: v.titleEn,
      titleBn: v.titleBn,
      descriptionEn: v.descriptionEn,
      descriptionBn: v.descriptionBn,
      badgeEn: v.badgeEn,
      badgeBn: v.badgeBn,
      price: v.price,
      image: v.image,
      published: v.published,
      sortOrder: v.sortOrder,
      updatedAt: new Date(),
    };
    if (v.id) {
      await db.update(offers).set(values).where(eq(offers.id, v.id));
    } else {
      await db.insert(offers).values(values);
    }
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function deleteOffer(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(offers).where(eq(offers.id, id));
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

// --- Gallery -------------------------------------------------------------
export async function upsertGallery(input: GalleryInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const p = gallerySchema.safeParse(input);
    if (!p.success) return fail(p.error.issues[0]?.message ?? "Invalid data");
    const v = p.data;
    const values = {
      url: v.url,
      category: v.category,
      captionEn: v.captionEn,
      captionBn: v.captionBn,
      published: v.published,
      sortOrder: v.sortOrder,
      updatedAt: new Date(),
    };
    if (v.id) {
      await db.update(galleryImages).set(values).where(eq(galleryImages.id, v.id));
    } else {
      await db.insert(galleryImages).values(values);
    }
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function deleteGallery(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

// --- Reviews -------------------------------------------------------------
export async function upsertReview(input: ReviewInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const p = reviewSchema.safeParse(input);
    if (!p.success) return fail(p.error.issues[0]?.message ?? "Invalid data");
    const v = p.data;
    const values = {
      author: v.author,
      rating: v.rating,
      bodyEn: v.bodyEn,
      bodyBn: v.bodyBn,
      source: v.source,
      published: v.published,
      sortOrder: v.sortOrder,
      updatedAt: new Date(),
    };
    if (v.id) {
      await db.update(reviews).set(values).where(eq(reviews.id, v.id));
    } else {
      await db.insert(reviews).values(values);
    }
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(reviews).where(eq(reviews.id, id));
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

// --- Site settings (singleton) -------------------------------------------
export async function updateSettings(input: SettingsInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const p = settingsSchema.safeParse(input);
    if (!p.success) return fail(p.error.issues[0]?.message ?? "Invalid data");
    const v = p.data;
    const values = {
      brand: v.brand,
      taglineEn: v.taglineEn,
      taglineBn: v.taglineBn,
      heroTitleEn: v.heroTitleEn,
      heroTitleBn: v.heroTitleBn,
      heroSubtitleEn: v.heroSubtitleEn,
      heroSubtitleBn: v.heroSubtitleBn,
      phone1: v.phone1,
      phone2: v.phone2,
      phone3: v.phone3,
      whatsapp: v.whatsapp,
      email: v.email,
      addressEn: v.addressEn,
      addressBn: v.addressBn,
      mapLat: v.mapLat != null ? String(v.mapLat) : null,
      mapLng: v.mapLng != null ? String(v.mapLng) : null,
      facebook: v.facebook,
      instagram: v.instagram,
      youtube: v.youtube,
      checkIn: v.checkIn,
      checkOut: v.checkOut,
      updatedAt: new Date(),
    };
    await db
      .insert(siteSettings)
      .values({ id: 1, ...values })
      .onConflictDoUpdate({ target: siteSettings.id, set: values });
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

// --- Bookings ------------------------------------------------------------
export async function updateBookingStatus(
  id: string,
  status: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const p = bookingStatusSchema.safeParse({ id, status });
    if (!p.success) return fail("Invalid status");
    await db
      .update(bookings)
      .set({ status: p.data.status, updatedAt: new Date() })
      .where(eq(bookings.id, p.data.id));
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}

// --- Room ↔ amenity assignment ------------------------------------------
export async function setRoomAmenities(
  roomId: string,
  amenityIds: string[],
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(roomAmenities).where(eq(roomAmenities.roomId, roomId));
    if (amenityIds.length) {
      await db
        .insert(roomAmenities)
        .values(amenityIds.map((amenityId) => ({ roomId, amenityId })));
    }
    return { ok: true };
  } catch (e) {
    return fail((e as Error).message);
  }
}
