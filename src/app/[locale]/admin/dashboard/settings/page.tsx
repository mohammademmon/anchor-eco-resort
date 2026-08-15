import { getSettingsRow } from "@/lib/admin-queries";
import { safe } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsAdminPage() {
  const settings = await safe(getSettingsRow, null);
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-ink">Site Settings</h2>
      <SettingsForm settings={settings} />
    </div>
  );
}
