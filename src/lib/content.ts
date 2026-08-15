// Static structural content for Phase 1 (no backend yet).
// Real data arrives in Phase 2.

export const WHATSAPP_NUMBER = "8801897629200";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// Primary navigation — every entry resolves to a real route.
export const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/rooms", key: "rooms" },
  { href: "/offers", key: "offers" },
  { href: "/gallery", key: "gallery" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/book", key: "book" },
] as const;

// The four room types (slugs are stable and used by generateStaticParams).
export const ROOM_SLUGS = [
  "super-deluxe-hill-side",
  "super-deluxe-sea-view",
  "premium-executive-cottage",
  "premium-deluxe-sea-view",
] as const;
export type RoomSlug = (typeof ROOM_SLUGS)[number];

// Placeholder offer ids (structure only).
export const OFFER_IDS = [
  "winter-escape",
  "honeymoon-retreat",
  "long-stay-saver",
] as const;
export type OfferId = (typeof OFFER_IDS)[number];

// Gallery filter categories.
export const GALLERY_CATEGORIES = [
  "pool",
  "rooms",
  "dining",
  "beach",
  "garden",
  "spa",
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

// Admin dashboard sidebar sections.
export const ADMIN_SECTIONS = [
  "bookings",
  "rooms",
  "offers",
  "gallery",
  "amenities",
  "reviews",
  "settings",
] as const;
export type AdminSection = (typeof ADMIN_SECTIONS)[number];
