"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Placeholder login — NO auth yet (Phase 2). Structure only.
export function AdminLoginForm() {
  const t = useTranslations("Admin.login");

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-line bg-paper-raised p-6">
      <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
      <p className="mt-1 text-sm text-ink-soft">{t("note")}</p>
      <form
        className="mt-6 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast(t("note"));
        }}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="admin-email">{t("email")}</Label>
          <Input id="admin-email" name="email" type="email" autoComplete="username" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="admin-password">{t("password")}</Label>
          <Input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </div>
        <Button type="submit">{t("submit")}</Button>
      </form>
      <Link
        href="/admin/dashboard"
        className="mt-4 inline-block text-sm font-medium text-forest hover:underline"
      >
        {t("viewDashboard")} →
      </Link>
    </div>
  );
}
