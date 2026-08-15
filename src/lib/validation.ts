import { z } from "zod";

// Shared inquiry schema for /book (full) and /contact (name/email/phone/message).
export const inquirySchema = z
  .object({
    source: z.enum(["booking", "contact"]).default("booking"),
    roomSlug: z.string().optional().default(""),
    checkIn: z.string().optional().default(""),
    checkOut: z.string().optional().default(""),
    adults: z.coerce.number().int().min(0).max(50).optional().default(1),
    children: z.coerce.number().int().min(0).max(50).optional().default(0),
    name: z.string().trim().min(2, "Please enter your name"),
    phone: z.string().trim().optional().default(""),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email")
      .optional()
      .or(z.literal("")),
    message: z.string().trim().optional().default(""),
  })
  .superRefine((v, ctx) => {
    if (!v.phone && !v.email) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Provide a phone number or email",
      });
    }
  });

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryValues = z.infer<typeof inquirySchema>;

// --- Admin CMS schemas ---------------------------------------------------

const bool = z.coerce.boolean();
const int = z.coerce.number().int();

export const roomSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  nameEn: z.string().trim().min(1, "English name is required"),
  nameBn: z.string().trim().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  descriptionBn: z.string().optional().default(""),
  view: z.string().optional().default(""),
  weekdayRate: int.min(0).default(0),
  weekendRate: int.min(0).default(0),
  occupancy: int.min(1).default(2),
  size: z.string().optional().default(""),
  images: z.array(z.string().url()).optional().default([]),
  featured: bool.optional().default(false),
  published: bool.optional().default(true),
  sortOrder: int.default(0),
});

export const amenitySchema = z.object({
  id: z.string().uuid().optional(),
  nameEn: z.string().trim().min(1, "English name is required"),
  nameBn: z.string().trim().optional().default(""),
  icon: z.string().optional().default(""),
  published: bool.optional().default(true),
  sortOrder: int.default(0),
});

export const offerSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  titleEn: z.string().trim().min(1, "English title is required"),
  titleBn: z.string().trim().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  descriptionBn: z.string().optional().default(""),
  badgeEn: z.string().optional().default(""),
  badgeBn: z.string().optional().default(""),
  price: z.string().optional().default(""),
  image: z.string().url().optional().or(z.literal("")).default(""),
  published: bool.optional().default(true),
  sortOrder: int.default(0),
});

export const gallerySchema = z.object({
  id: z.string().uuid().optional(),
  url: z.string().url("An image is required"),
  category: z.string().min(1),
  captionEn: z.string().optional().default(""),
  captionBn: z.string().optional().default(""),
  published: bool.optional().default(true),
  sortOrder: int.default(0),
});

export const reviewSchema = z.object({
  id: z.string().uuid().optional(),
  author: z.string().trim().min(1, "Author is required"),
  rating: int.min(1).max(5).default(5),
  bodyEn: z.string().trim().min(1, "English review is required"),
  bodyBn: z.string().optional().default(""),
  source: z.string().optional().default(""),
  published: bool.optional().default(true),
  sortOrder: int.default(0),
});

export const settingsSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required"),
  taglineEn: z.string().optional().default(""),
  taglineBn: z.string().optional().default(""),
  heroTitleEn: z.string().optional().default(""),
  heroTitleBn: z.string().optional().default(""),
  heroSubtitleEn: z.string().optional().default(""),
  heroSubtitleBn: z.string().optional().default(""),
  phone1: z.string().optional().default(""),
  phone2: z.string().optional().default(""),
  phone3: z.string().optional().default(""),
  whatsapp: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")).default(""),
  addressEn: z.string().optional().default(""),
  addressBn: z.string().optional().default(""),
  mapLat: z.coerce.number().optional().nullable(),
  mapLng: z.coerce.number().optional().nullable(),
  facebook: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
  checkIn: z.string().optional().default(""),
  checkOut: z.string().optional().default(""),
});

export const bookingStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "confirmed", "cancelled", "completed"]),
});

export type RoomInput = z.input<typeof roomSchema>;
export type AmenityInput = z.input<typeof amenitySchema>;
export type OfferInput = z.input<typeof offerSchema>;
export type GalleryInput = z.input<typeof gallerySchema>;
export type ReviewInput = z.input<typeof reviewSchema>;
export type SettingsInput = z.input<typeof settingsSchema>;
