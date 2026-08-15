"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBookingStatus } from "@/lib/actions/admin";
import type { Booking } from "@/lib/db/schema";

const STATUSES = ["new", "contacted", "confirmed", "cancelled", "completed"] as const;

export function BookingsManager({ rows }: { rows: Booking[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  async function changeStatus(id: string, status: string) {
    const res = await updateBookingStatus(id, status);
    if (res.ok) {
      toast.success("Status updated");
      router.refresh();
    } else toast.error(res.error);
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-sand/40 text-left text-ink-soft">
          <tr>
            <th className="p-3">Received</th>
            <th className="p-3">Name</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Room / Dates</th>
            <th className="p-3">Type</th>
            <th className="p-3">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <Fragment key={b.id}>
              <tr className="border-t border-line align-top">
                <td className="p-3 text-ink-soft">
                  {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="p-3 text-ink">{b.name}</td>
                <td className="p-3 text-ink-soft">
                  {b.phone || "—"}
                  {b.email ? <div>{b.email}</div> : null}
                </td>
                <td className="p-3 text-ink-soft">
                  {b.roomSlug || "—"}
                  {b.checkIn ? (
                    <div>
                      {b.checkIn} → {b.checkOut}
                    </div>
                  ) : null}
                </td>
                <td className="p-3 text-ink-soft">{b.source}</td>
                <td className="p-3">
                  <select
                    value={b.status}
                    onChange={(e) => changeStatus(b.id, e.target.value)}
                    className="rounded-lg border border-line bg-paper px-2 py-1 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button
                    className="text-forest hover:underline"
                    onClick={() => setOpen(open === b.id ? null : b.id)}
                  >
                    {open === b.id ? "Hide" : "Details"}
                  </button>
                </td>
              </tr>
              {open === b.id && (
                <tr className="border-t border-line bg-sand/20">
                  <td colSpan={7} className="p-4 text-ink-soft">
                    <p>
                      <strong className="text-ink">Guests:</strong> {b.adults} adult(s),{" "}
                      {b.children} child(ren)
                    </p>
                    <p className="mt-1">
                      <strong className="text-ink">Message:</strong> {b.message || "—"}
                    </p>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-ink-soft">
                No bookings yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
