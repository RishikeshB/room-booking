"use client";

import { useState, useMemo } from "react";

import { GlassmorphicRoomGrid } from "@/components/glassmorphic-room-grid";

type Room = {
  _id: string;
  name: string;
  roomType: "AC" | "Non-AC" | "AC Window";
  occupancy: number;
  status: "available" | "occupied";
  booking?: {
    userName: string;
    userId: string;
    photoUrl: string;
    contactNumber: string;
    createdAt: string;
  };
};

export function RoomGridWithFilters({
  rooms,
  currentUserId,
  userRole
}: {
  rooms: Room[];
  currentUserId: string;
  userRole: string;
}) {
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchType = roomTypeFilter ? room.roomType === roomTypeFilter : true;
      const matchStatus = statusFilter ? room.status === statusFilter : true;
      return matchType && matchStatus;
    });
  }, [rooms, roomTypeFilter, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Room Type:</label>
          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-400"
          >
            <option value="">All Types</option>
            <option value="AC">AC</option>
            <option value="AC Window">AC Window</option>
            <option value="Non-AC">Non-AC</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-400"
          >
            <option value="">All</option>
            <option value="occupied">Occupied</option>
            <option value="available">Un-occupied</option>
          </select>
        </div>

        {(roomTypeFilter || statusFilter) && (
          <button
            onClick={() => {
              setRoomTypeFilter("");
              setStatusFilter("");
            }}
            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Clear Filters
          </button>
        )}

        <span className="ml-auto text-sm text-slate-600">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </span>
      </div>

      {/* Room Grid */}
      <GlassmorphicRoomGrid
        rooms={filteredRooms}
        currentUserId={currentUserId}
        userRole={userRole}
      />
    </div>
  );
}
