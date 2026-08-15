import { getAllAmenities } from "@/lib/admin-queries";
import { safe } from "@/lib/queries";
import { AmenitiesManager } from "@/components/admin/AmenitiesManager";

export default async function AmenitiesAdminPage() {
  const rows = await safe(getAllAmenities, []);
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-ink">Amenities</h2>
      <AmenitiesManager rows={rows} />
    </div>
  );
}
