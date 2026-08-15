"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ADMIN_SECTIONS, type AdminSection } from "@/lib/content";
import { cn } from "@/lib/utils";

// Dashboard shell only — sidebar nav + empty placeholder panels. NO CRUD (Phase 2).
export function AdminDashboard() {
  const t = useTranslations("Admin.dashboard");
  const [active, setActive] = useState<AdminSection>(ADMIN_SECTIONS[0]);

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="rounded-2xl border border-line bg-paper-raised p-3">
        <p className="px-3 py-2 font-display text-lg text-ink">{t("title")}</p>
        <nav aria-label={t("title")}>
          <ul className="space-y-1">
            {ADMIN_SECTIONS.map((section) => (
              <li key={section}>
                <button
                  type="button"
                  onClick={() => setActive(section)}
                  aria-current={active === section ? "page" : undefined}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm",
                    active === section
                      ? "bg-forest text-paper"
                      : "text-ink-soft hover:bg-sand/50 hover:text-ink",
                  )}
                >
                  {t(`nav.${section}`)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Panel */}
      <section
        aria-label={t(`nav.${active}`)}
        className="rounded-2xl border border-line p-6"
      >
        <h2 className="font-display text-xl text-ink">{t(`nav.${active}`)}</h2>
        <div className="mt-6 flex min-h-40 items-center justify-center rounded-xl border border-dashed border-line bg-sand/30 text-sm text-ink-soft">
          {t("empty")}
        </div>
      </section>
    </div>
  );
}
