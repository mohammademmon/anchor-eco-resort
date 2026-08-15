"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { inquirySchema, type InquiryInput } from "@/lib/validation";
import { createBooking } from "@/lib/actions/booking";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type RoomOption = { slug: string; name: string };

export function BookingForm({
  rooms,
  defaultRoomSlug = "",
}: {
  rooms: RoomOption[];
  defaultRoomSlug?: string;
}) {
  const t = useTranslations("Book.form");
  const tc = useTranslations("Common");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      source: "booking",
      roomSlug: defaultRoomSlug,
      checkIn: "",
      checkOut: "",
      adults: 2,
      children: 0,
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const fieldClass =
    "rounded-lg border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal";

  if (done) {
    return (
      <div className="max-w-2xl rounded-2xl border border-line bg-paper-raised p-6">
        <p className="text-ink">{tc("formSuccess")}</p>
        <Button className="mt-4" variant="outline" onClick={() => setDone(false)}>
          {t("submit")}
        </Button>
      </div>
    );
  }

  return (
    <form
      className="grid max-w-2xl gap-4"
      onSubmit={handleSubmit(async (values) => {
        const res = await createBooking(values);
        if (res.ok) {
          toast.success(tc("formSuccess"));
          reset();
          setDone(true);
        } else {
          toast.error(res.error || tc("formError"));
        }
      })}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="book-room">{t("room")}</Label>
        <select id="book-room" className={fieldClass} {...register("roomSlug")}>
          <option value="">{t("selectRoom")}</option>
          {rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="book-checkin">{t("checkIn")}</Label>
          <Input id="book-checkin" type="date" {...register("checkIn")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="book-checkout">{t("checkOut")}</Label>
          <Input id="book-checkout" type="date" {...register("checkOut")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="book-adults">{t("adults")}</Label>
          <Input id="book-adults" type="number" min={1} {...register("adults")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="book-children">{t("children")}</Label>
          <Input id="book-children" type="number" min={0} {...register("children")} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="book-name">{t("name")}</Label>
        <Input id="book-name" autoComplete="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-700">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="book-phone">{t("phone")}</Label>
          <Input id="book-phone" type="tel" autoComplete="tel" {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-red-700">{errors.phone.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="book-email">{t("email")}</Label>
          <Input id="book-email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-700">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="book-message">{t("message")}</Label>
        <textarea id="book-message" rows={4} className={fieldClass} {...register("message")} />
      </div>

      <Button type="submit" className="w-fit" disabled={isSubmitting}>
        {isSubmitting ? tc("sending") : t("submit")}
      </Button>
    </form>
  );
}
