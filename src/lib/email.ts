import { Resend } from "resend";

type BookingEmailData = {
  source: string;
  roomLabel: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  name: string;
  phone: string;
  email: string;
  message: string;
};

// Sends a booking/contact inquiry email to the resort inbox.
// NOTE: uses Resend's test sender for now — TODO switch to the resort's
// verified domain at go-live. Best-effort: email failure must NOT fail the
// booking (the DB write is the critical path).
export async function sendInquiryEmail(data: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESORT_INQUIRY_EMAIL;

  if (!apiKey || !to) {
    return { sent: false, reason: "Email not configured" };
  }

  const resend = new Resend(apiKey);
  const subject =
    data.source === "contact"
      ? `New contact inquiry — ${data.name}`
      : `New booking inquiry — ${data.name}`;

  const lines = [
    `Type: ${data.source}`,
    data.roomLabel ? `Room: ${data.roomLabel}` : null,
    data.checkIn ? `Check-in: ${data.checkIn}` : null,
    data.checkOut ? `Check-out: ${data.checkOut}` : null,
    `Guests: ${data.adults} adult(s), ${data.children} child(ren)`,
    `Name: ${data.name}`,
    `Phone: ${data.phone || "—"}`,
    `Email: ${data.email || "—"}`,
    `Message: ${data.message || "—"}`,
  ].filter(Boolean);

  try {
    const { error } = await resend.emails.send({
      // TODO: replace with a verified resort domain sender at go-live.
      from: "Anchor Eco Resort <onboarding@resend.dev>",
      to,
      subject,
      text: lines.join("\n"),
      replyTo: data.email || undefined,
    });
    if (error) return { sent: false, reason: error.message };
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: (err as Error).message };
  }
}
