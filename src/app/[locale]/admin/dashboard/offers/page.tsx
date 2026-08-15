import { getAllOffers } from "@/lib/admin-queries";
import { safe } from "@/lib/queries";
import { OffersManager } from "@/components/admin/OffersManager";

export default async function OffersAdminPage() {
  const rows = await safe(getAllOffers, []);
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-ink">Offers</h2>
      <OffersManager rows={rows} />
    </div>
  );
}
