import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function RoomWidget({ room }: { room: any }) {
  const occupied = room.status === "occupied" || Boolean(room.booking);

  return (
    <article className="panel flex h-full flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{room.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{room.roomType} • {room.bedSize}</p>
        </div>
        <Badge className={occupied ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}>{occupied ? "Occupied" : "Available"}</Badge>
      </div>
      <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/60 p-4 text-sm text-slate-700">
        <div className="flex items-center gap-2 font-medium">
          <span>{occupied ? "??" : "??"}</span>
          <span>{occupied ? "Allocated room" : "Ready to assign"}</span>
        </div>
        {room.booking ? (
          <div className="mt-4 space-y-3">
            {room.booking.photoUrl ? (
              <div className="relative h-44 overflow-hidden rounded-3xl bg-slate-100">
                <Image alt={room.name} className="object-cover" fill sizes="400px" src={room.booking.photoUrl} />
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div>
              <p className="font-semibold text-ink">Contact</p>
              <p>{room.booking.contactNumber}</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Allocated</p>
              <p>{formatDate(room.booking.createdAt)}</p>
            </div>
          </div>
        ) : (
          <p className="mt-3">No active resident record for this room.</p>
        )}
      </div>
    </article>
  );
}

