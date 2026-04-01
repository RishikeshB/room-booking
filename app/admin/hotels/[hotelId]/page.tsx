import Link from "next/link";
import { notFound } from "next/navigation";

import { HotelSettingsForm } from "@/components/admin/hotel-settings-form";
import { RoomForm } from "@/components/admin/room-form";
import { RoomManager } from "@/components/admin/room-manager";
import { GlassmorphicRoomGrid } from "@/components/glassmorphic-room-grid";
import { getHotelRoomDetails } from "@/lib/repositories";

export default async function HotelDetailPage({ params }: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = await params;
  const detail = await getHotelRoomDetails(hotelId);
  const data = detail ? JSON.parse(JSON.stringify(detail)) : null;

  if (!data) {
    notFound();
  }

  const occupiedCount = data.rooms.filter((room: { booking: unknown }) => room.booking).length;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
      <Link className="text-sm font-semibold text-brand-800" href="/admin">← Back to dashboard</Link>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Hotel detail</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">{data.hotel.name}</h2>
            <p className="mt-2 text-slate-600">{data.hotel.location}</p>
            {data.hotel.description ? <p className="mt-4 text-sm text-slate-500">{data.hotel.description}</p> : null}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-3xl bg-mist p-4 text-center"><p className="text-sm text-slate-500">Rooms</p><p className="mt-1 text-2xl font-semibold text-ink">{data.rooms.length}</p></div>
              <div className="rounded-3xl bg-red-50 p-4 text-center"><p className="text-sm text-slate-500">Occupied</p><p className="mt-1 text-2xl font-semibold text-red-700">{occupiedCount}</p></div>
              <div className="rounded-3xl bg-emerald-50 p-4 text-center"><p className="text-sm text-slate-500">Open</p><p className="mt-1 text-2xl font-semibold text-emerald-700">{data.rooms.length - occupiedCount}</p></div>
            </div>
          </div>
          <HotelSettingsForm hotel={data.hotel} />
          <RoomForm hotelId={hotelId} />
          <RoomManager rooms={data.rooms.map((room: { _id: string; name: string; roomType: "AC" | "Non-AC"; bedSize: "King" | "Queen" | "Twin"; status: "available" | "occupied" }) => ({ _id: room._id, name: room.name, roomType: room.roomType, bedSize: room.bedSize, status: room.status }))} />
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Room widget grid</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Live room status</h2>
            </div>
          </div>
          <GlassmorphicRoomGrid rooms={data.rooms} />
        </div>
      </section>
    </div>
  );
}