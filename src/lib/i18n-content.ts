// Pick a localized field: Bangla when present for the bn locale, else English.
export function loc(
  en: string | null | undefined,
  bn: string | null | undefined,
  locale: string,
): string {
  if (locale === "bn" && bn && bn.trim().length > 0) return bn;
  return en ?? "";
}
