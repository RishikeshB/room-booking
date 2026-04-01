"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BED_SIZES, ROOM_TYPES } from "@/lib/constants";

type RoomFormState = {
  name: string;
  roomType: (typeof ROOM_TYPES)[number];
  bedSize: (typeof BED_SIZES)[number];
};

const initialState: RoomFormState = {
  name: "",
  roomType: ROOM_TYPES[0],
  bedSize: BED_SIZES[0]
};

export function RoomForm({ hotelId }: { hotelId: string }) {
  const router = useRouter();
  const [form, setForm] = useState<RoomFormState>(initialState);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, hotelId })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(data.error ?? "Unable to create room");
      return;
    }

    toast.success("Room created");
    setForm(initialState);
    router.refresh();
  }

  return (
    <form className="panel space-y-4 p-5" onSubmit={onSubmit}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Room management</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Add room</h2>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Room name / number</label>
        <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Room type</label>
        <Select value={form.roomType} onChange={(event) => setForm((current) => ({ ...current, roomType: event.target.value as RoomFormState["roomType"] }))}>
          {ROOM_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Bed size</label>
        <Select value={form.bedSize} onChange={(event) => setForm((current) => ({ ...current, bedSize: event.target.value as RoomFormState["bedSize"] }))}>
          {BED_SIZES.map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
      </div>
      <Button className="w-full" disabled={loading} type="submit">{loading ? "Saving..." : "Create room"}</Button>
    </form>
  );
}

