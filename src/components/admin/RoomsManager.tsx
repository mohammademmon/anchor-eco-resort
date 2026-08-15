"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { roomSchema, type RoomInput } from "@/lib/validation";
import { upsertRoom, deleteRoom, setRoomAmenities } from "@/lib/actions/admin";
import type { Room, Amenity } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";

const blank: RoomInput = {
  slug: "",
  nameEn: "",
  nameBn: "",
  shortEn: "",
  shortBn: "",
  descriptionEn: "",
  descriptionBn: "",
  view: "",
  weekdayRate: 0,
  weekendRate: 0,
  occupancy: 2,
  size: "",
  images: [],
  featured: false,
  published: true,
  sortOrder: 0,
};

const ta =
  "rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal";

export function RoomsManager({
  rows,
  allAmenities,
  roomAmenityMap,
}: {
  rows: Room[];
  allAmenities: Amenity[];
  roomAmenityMap: Record<string, string[]>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<RoomInput>(blank);
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoomInput>({ resolver: zodResolver(roomSchema), values: editing });
  const images = watch("images") ?? [];

  function startEdit(r: Room) {
    setEditing({
      id: r.id,
      slug: r.slug,
      nameEn: r.nameEn,
      nameBn: r.nameBn,
      shortEn: r.shortEn ?? "",
      shortBn: r.shortBn ?? "",
      descriptionEn: r.descriptionEn,
      descriptionBn: r.descriptionBn,
      view: r.view,
      weekdayRate: r.weekdayRate,
      weekendRate: r.weekendRate,
      occupancy: r.occupancy,
      size: r.size ?? "",
      images: r.images ?? [],
      featured: r.featured,
      published: r.published,
      sortOrder: r.sortOrder,
    });
    setAmenityIds(roomAmenityMap[r.id] ?? []);
  }

  function reset() {
    setEditing(blank);
    setAmenityIds([]);
  }

  async function onSubmit(values: RoomInput) {
    const res = await upsertRoom(values);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    if (res.id) await setRoomAmenities(res.id, amenityIds);
    toast.success("Saved");
    reset();
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this room?")) return;
    const res = await deleteRoom(id);
    if (res.ok) {
      toast.success("Deleted");
      router.refresh();
    } else toast.error(res.error);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-sand/40 text-left text-ink-soft">
            <tr>
              <th className="p-3">Name (EN)</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Rates</th>
              <th className="p-3">Pub / Feat</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="p-3 text-ink">{r.nameEn}</td>
                <td className="p-3 text-ink-soft">{r.slug}</td>
                <td className="p-3">
                  {r.weekdayRate} / {r.weekendRate}
                </td>
                <td className="p-3">
                  {r.published ? "Yes" : "No"} / {r.featured ? "★" : "—"}
                </td>
                <td className="p-3 text-right">
                  <button className="mr-3 text-forest hover:underline" onClick={() => startEdit(r)}>
                    Edit
                  </button>
                  <button className="text-red-700 hover:underline" onClick={() => onDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-ink-soft">
                  No rooms yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid h-fit gap-3 rounded-2xl border border-line bg-paper-raised p-5"
      >
        <h3 className="font-display text-lg text-ink">
          {editing.id ? "Edit room" : "New room"}
        </h3>
        <div className="grid gap-1.5">
          <Label htmlFor="rm-slug">Slug</Label>
          <Input id="rm-slug" {...register("slug")} />
          {errors.slug && <p className="text-sm text-red-700">{errors.slug.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="rm-nameEn">Name (EN)</Label>
            <Input id="rm-nameEn" {...register("nameEn")} />
            {errors.nameEn && <p className="text-sm text-red-700">{errors.nameEn.message}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rm-nameBn">Name (BN)</Label>
            <Input id="rm-nameBn" {...register("nameBn")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="rm-shortEn">Short (EN)</Label>
            <Input id="rm-shortEn" {...register("shortEn")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rm-shortBn">Short (BN)</Label>
            <Input id="rm-shortBn" {...register("shortBn")} />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="rm-descEn">Description (EN)</Label>
          <textarea id="rm-descEn" rows={2} className={ta} {...register("descriptionEn")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="rm-descBn">Description (BN)</Label>
          <textarea id="rm-descBn" rows={2} className={ta} {...register("descriptionBn")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="rm-view">View</Label>
            <Input id="rm-view" placeholder="sea / hill / cottage" {...register("view")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rm-occ">Occupancy</Label>
            <Input id="rm-occ" type="number" min={1} {...register("occupancy")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="rm-wd">Weekday rate</Label>
            <Input id="rm-wd" type="number" {...register("weekdayRate")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rm-we">Weekend rate</Label>
            <Input id="rm-we" type="number" {...register("weekendRate")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="rm-size">Size</Label>
            <Input id="rm-size" {...register("size")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rm-order">Sort order</Label>
            <Input id="rm-order" type="number" {...register("sortOrder")} />
          </div>
        </div>

        {/* Images */}
        <div className="grid gap-1.5">
          <Label>Images</Label>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((url, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="aspect-square w-full rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        "images",
                        images.filter((_, idx) => idx !== i),
                      )
                    }
                    className="absolute right-1 top-1 rounded bg-night/70 px-1.5 text-xs text-on-night"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <ImageUploader folder="rooms" onUploaded={(url) => setValue("images", [...images, url])} />
        </div>

        {/* Amenities */}
        <div className="grid gap-1.5">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 gap-1">
            {allAmenities.map((a) => (
              <label key={a.id} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={amenityIds.includes(a.id)}
                  onChange={(e) =>
                    setAmenityIds((prev) =>
                      e.target.checked
                        ? [...prev, a.id]
                        : prev.filter((x) => x !== a.id),
                    )
                  }
                />
                {a.nameEn}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" {...register("published")} /> Published
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" {...register("featured")} /> Featured
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
          {editing.id && (
            <Button type="button" variant="outline" onClick={reset}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
