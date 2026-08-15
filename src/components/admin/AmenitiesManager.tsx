"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { amenitySchema, type AmenityInput } from "@/lib/validation";
import { upsertAmenity, deleteAmenity } from "@/lib/actions/admin";
import type { Amenity } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const blank: AmenityInput = {
  nameEn: "",
  nameBn: "",
  icon: "",
  published: true,
  sortOrder: 0,
};

export function AmenitiesManager({ rows }: { rows: Amenity[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AmenityInput>(blank);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AmenityInput>({ resolver: zodResolver(amenitySchema), values: editing });

  async function onSubmit(values: AmenityInput) {
    const res = await upsertAmenity(values);
    if (res.ok) {
      toast.success("Saved");
      setEditing(blank);
      router.refresh();
    } else toast.error(res.error);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this amenity?")) return;
    const res = await deleteAmenity(id);
    if (res.ok) {
      toast.success("Deleted");
      router.refresh();
    } else toast.error(res.error);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-sand/40 text-left text-ink-soft">
            <tr>
              <th className="p-3">Name (EN)</th>
              <th className="p-3">Published</th>
              <th className="p-3">Order</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="p-3 text-ink">{r.nameEn}</td>
                <td className="p-3">{r.published ? "Yes" : "No"}</td>
                <td className="p-3">{r.sortOrder}</td>
                <td className="p-3 text-right">
                  <button
                    className="mr-3 text-forest hover:underline"
                    onClick={() =>
                      setEditing({
                        id: r.id,
                        nameEn: r.nameEn,
                        nameBn: r.nameBn,
                        icon: r.icon ?? "",
                        published: r.published,
                        sortOrder: r.sortOrder,
                      })
                    }
                  >
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
                <td colSpan={4} className="p-4 text-ink-soft">
                  No amenities yet.
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
          {editing.id ? "Edit amenity" : "New amenity"}
        </h3>
        <div className="grid gap-1.5">
          <Label htmlFor="am-nameEn">Name (EN)</Label>
          <Input id="am-nameEn" {...register("nameEn")} />
          {errors.nameEn && <p className="text-sm text-red-700">{errors.nameEn.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="am-nameBn">Name (BN)</Label>
          <Input id="am-nameBn" {...register("nameBn")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="am-order">Sort order</Label>
          <Input id="am-order" type="number" {...register("sortOrder")} />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" {...register("published")} /> Published
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
          {editing.id && (
            <Button type="button" variant="outline" onClick={() => setEditing(blank)}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
