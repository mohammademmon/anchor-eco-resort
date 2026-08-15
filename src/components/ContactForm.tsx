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

export function ContactForm() {
  const t = useTranslations("Contact.form");
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
      source: "contact",
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  if (done) {
    return (
      <div className="max-w-xl rounded-2xl border border-line bg-paper-raised p-6">
        <p className="text-ink">{tc("formSuccess")}</p>
        <Button className="mt-4" variant="outline" onClick={() => setDone(false)}>
          {t("submit")}
        </Button>
      </div>
    );
  }

  return (
    <form
      className="grid max-w-xl gap-4"
      onSubmit={handleSubmit(async (values) => {
        const res = await createBooking({ ...values, source: "contact" });
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
        <Label htmlFor="contact-name">{t("name")}</Label>
        <Input id="contact-name" autoComplete="name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-700">{errors.name.message}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-email">{t("email")}</Label>
        <Input id="contact-email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-700">{errors.email.message}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-phone">{t("phone")}</Label>
        <Input id="contact-phone" type="tel" autoComplete="tel" {...register("phone")} />
        {errors.phone && <p className="text-sm text-red-700">{errors.phone.message}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-message">{t("message")}</Label>
        <textarea
          id="contact-message"
          rows={5}
          className="rounded-lg border border-line bg-paper-raised px-4 py-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal"
          {...register("message")}
        />
      </div>
      <Button type="submit" className="w-fit" disabled={isSubmitting}>
        {isSubmitting ? tc("sending") : t("submit")}
      </Button>
    </form>
  );
}
