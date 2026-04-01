"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BED_SIZES, ROOM_TYPES } from "@/lib/constants";

type Room = {
  _id: string;
  name: string;
  roomType: (typeof ROOM_TYPES)[number];
  bedSize: (typeof BED_SIZES)[number];
  status: "available" | "occupied";
};

type Drafts = Record<string, Pick<Room, "name" | "roomType" | "bedSize">>;

export function RoomManager({ rooms }: { rooms: Room[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Drafts>(
    Object.fromEntries(rooms.map((room) => [room._id, { name: room.name, roomType: room.roomType, bedSize: room.bedSize }]))
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  async function saveRoom(roomId: string) {
    setSavingId(roomId);

    const response = await fetch(`/api/rooms/${roomId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drafts[roomId])
    });

    const data = await response.json();
    setSavingId(null);

    if (!response.ok) {
      toast.error(data.error ?? "Unable to update room");
      return;
    }

    toast.success("Room updated");
    router.refresh();
  }

  if (rooms.length === 0) {
    return (
      <div className="panel p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Room management</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Edit inventory</h2>
        </div>
        <div className="panel-muted mt-4 p-6 text-sm text-slate-600">
          No rooms yet. Use the "Add room" form to create your first room.
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Room management</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Edit inventory</h2>
      </div>
      <div className="mt-4 space-y-4">
        {rooms.map((room) => (
          <div className="rounded-3xl border border-brand-100 bg-white p-4" key={room._id}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-semibold text-ink">{room.name}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${room.status === "occupied" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{room.status}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_0.8fr_auto] md:items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Room name</label>
                <Input value={drafts[room._id]?.name ?? room.name} onChange={(event) => setDrafts((current) => ({ ...current, [room._id]: { ...(current[room._id] ?? { name: room.name, roomType: room.roomType, bedSize: room.bedSize }), name: event.target.value } }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Room type</label>
                <Select value={drafts[room._id]?.roomType ?? room.roomType} onChange={(event) => setDrafts((current) => ({ ...current, [room._id]: { ...(current[room._id] ?? { name: room.name, roomType: room.roomType, bedSize: room.bedSize }), roomType: event.target.value as Room["roomType"] } }))}>
                  {ROOM_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Bed size</label>
                <Select value={drafts[room._id]?.bedSize ?? room.bedSize} onChange={(event) => setDrafts((current) => ({ ...current, [room._id]: { ...(current[room._id] ?? { name: room.name, roomType: room.roomType, bedSize: room.bedSize }), bedSize: event.target.value as Room["bedSize"] } }))}>
                  {BED_SIZES.map((option) => <option key={option} value={option}>{option}</option>)}
                </Select>
              </div>
              <Button disabled={savingId === room._id} onClick={() => saveRoom(room._id)} type="button">
                {savingId === room._id ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}