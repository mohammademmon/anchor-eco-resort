import {
  getAllRooms,
  getAllAmenities,
  getRoomAmenityMap,
} from "@/lib/admin-queries";
import { safe } from "@/lib/queries";
import { RoomsManager } from "@/components/admin/RoomsManager";

export default async function RoomsAdminPage() {
  const [rows, amenities, map] = await Promise.all([
    safe(getAllRooms, []),
    safe(getAllAmenities, []),
    safe(getRoomAmenityMap, {} as Record<string, string[]>),
  ]);
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-ink">Rooms</h2>
      <RoomsManager rows={rows} allAmenities={amenities} roomAmenityMap={map} />
    </div>
  );
}
