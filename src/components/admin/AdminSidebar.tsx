"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ADMIN_SECTIONS } from "@/lib/content";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const t = useTranslations("Admin.dashboard");
  const pathname = usePathname();

  return (
    <nav aria-label={t("title")} className="rounded-2xl border border-line bg-paper-raised p-3">
      <ul className="space-y-1">
        {ADMIN_SECTIONS.map((section) => {
          const href = `/admin/dashboard/${section}`;
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={section}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm",
                  active
                    ? "bg-forest text-paper"
                    : "text-ink-soft hover:bg-sand/50 hover:text-ink",
                )}
              >
                {t(`nav.${section}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
