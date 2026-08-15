"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ROOM_SLUGS } from "@/lib/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Structure only — not wired to a backend (Phase 2).
export function BookingForm() {
  const t = useTranslations("Book.form");
  const tr = useTranslations("Rooms");
  const tc = useTranslations("Common");

  const fieldClass =
    "rounded-lg border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal";

  return (
    <form
      className="grid max-w-2xl gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        toast(tc("notWired"));
      }}
    >
      {/* Room */}
      <div className="grid gap-1.5">
        <Label htmlFor="book-room">{t("room")}</Label>
        <select id="book-room" name="room" defaultValue="" className={fieldClass}>
          <option value="" disabled>
            {t("selectRoom")}
          </option>
          {ROOM_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {tr(`items.${slug}.name`)}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="book-checkin">{t("checkIn")}</Label>
          <Input id="book-checkin" name="checkIn" type="date" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="book-checkout">{t("checkOut")}</Label>
          <Input id="book-checkout" name="checkOut" type="date" />
        </div>
      </div>

      {/* Guests */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="book-adults">{t("adults")}</Label>
          <Input id="book-adults" name="adults" type="number" min={1} defaultValue={2} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="book-children">{t("children")}</Label>
          <Input id="book-children" name="children" type="number" min={0} defaultValue={0} />
        </div>
      </div>

      {/* Contact */}
      <div className="grid gap-1.5">
        <Label htmlFor="book-name">{t("name")}</Label>
        <Input id="book-name" name="name" autoComplete="name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="book-phone">{t("phone")}</Label>
          <Input id="book-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="book-email">{t("email")}</Label>
          <Input id="book-email" name="email" type="email" autoComplete="email" />
        </div>
      </div>

      {/* Message */}
      <div className="grid gap-1.5">
        <Label htmlFor="book-message">{t("message")}</Label>
        <textarea
          id="book-message"
          name="message"
          rows={4}
          className="rounded-lg border border-line bg-paper-raised px-4 py-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal"
        />
      </div>

      <Button type="submit" className="w-fit">
        {t("submit")}
      </Button>
    </form>
  );
}
