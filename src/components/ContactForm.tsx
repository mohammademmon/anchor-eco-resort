"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Structure only — not wired to a backend (Phase 2).
export function ContactForm() {
  const t = useTranslations("Contact.form");
  const tc = useTranslations("Common");

  return (
    <form
      className="grid max-w-xl gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        toast(tc("notWired"));
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="contact-name">{t("name")}</Label>
        <Input id="contact-name" name="name" autoComplete="name" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-email">{t("email")}</Label>
        <Input id="contact-email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-phone">{t("phone")}</Label>
        <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-message">{t("message")}</Label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          className="rounded-lg border border-line bg-paper-raised px-4 py-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal"
        />
      </div>
      <Button type="submit" className="w-fit">
        {t("submit")}
      </Button>
    </form>
  );
}
