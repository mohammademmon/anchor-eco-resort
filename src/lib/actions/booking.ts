"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendInquiryEmail } from "@/lib/email";
import { inquirySchema, type InquiryInput } from "@/lib/validation";

export type BookingResult =
  | { ok: true }
  | { ok: false; error: string };

// Public server action: validates → inserts a bookings row (anon insert per
// RLS) → sends the resort an email (best-effort). DB write is the critical path.
export async function createBooking(input: InquiryInput): Promise<BookingResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  const v = parsed.data;

  const supabase = await createSupabaseServerClient();

  // Resolve room id + label from the slug (published rooms only).
  let roomId: string | null = null;
  let roomLabel = "";
  if (v.roomSlug) {
    const { data: room } = await supabase
      .from("rooms")
      .select("id, name_en")
      .eq("slug", v.roomSlug)
      .maybeSingle();
    if (room) {
      roomId = room.id as string;
      roomLabel = (room.name_en as string) ?? v.roomSlug;
    } else {
      roomLabel = v.roomSlug;
    }
  }

  // Critical path: insert the inquiry (RLS allows anon insert).
  const { error } = await supabase.from("bookings").insert({
    room_id: roomId,
    room_slug: v.roomSlug ?? "",
    check_in: v.checkIn || null,
    check_out: v.checkOut || null,
    adults: v.adults ?? 1,
    children: v.children ?? 0,
    name: v.name,
    phone: v.phone ?? "",
    email: v.email ?? "",
    message: v.message ?? "",
    source: v.source,
  });

  if (error) {
    return { ok: false, error: "Could not submit your inquiry. Please try again." };
  }

  // Best-effort email — never fails the booking.
  await sendInquiryEmail({
    source: v.source,
    roomLabel,
    checkIn: v.checkIn ?? "",
    checkOut: v.checkOut ?? "",
    adults: v.adults ?? 1,
    children: v.children ?? 0,
    name: v.name,
    phone: v.phone ?? "",
    email: v.email ?? "",
    message: v.message ?? "",
  });

  return { ok: true };
}
