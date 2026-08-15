import { getAllGallery } from "@/lib/admin-queries";
import { safe } from "@/lib/queries";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default async function GalleryAdminPage() {
  const rows = await safe(getAllGallery, []);
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-ink">Gallery</h2>
      <GalleryManager rows={rows} />
    </div>
  );
}
