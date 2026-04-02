"use client";

import Image from "next/image";
import { useState } from "react";

import { RoomActions } from "@/components/room-actions";
import { formatDate } from "@/lib/utils";

type Room = {
  _id: string;
  name: string;
  roomType: "AC" | "Non-AC" | "AC Window";
  occupancy: number;
  status: "available" | "occupied";
  booking?: {
    _id?: string;
    userName: string;
    userId: string;
    photoUrl: string;
    contactNumber: string;
    createdAt: string;
  };
};

export function GlassmorphicRoomGrid({ rooms, currentUserId, userRole }: { rooms: Room[]; currentUserId: string; userRole: string }) {
  const [viewPhotoRoom, setViewPhotoRoom] = useState<Room | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => {
          const isOccupied = room.status === "occupied" || Boolean(room.booking);

          return (
            <div
              key={room._id}
              className={`relative overflow-hidden rounded-3xl border p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isOccupied
                ? "border-green-300/50 bg-gradient-to-br from-green-50/80 via-green-50/60 to-green-100/50 shadow-green-200/50"
                : "border-red-200/50 bg-gradient-to-br from-red-50/60 via-white/50 to-red-100/40 shadow-red-100/40"
                }`}
            >
              {/* Glassmorphic shine effect */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-50" />

              {/* Status indicator bar */}
              <div
                className={`absolute left-0 top-0 h-full w-1.5 ${isOccupied
                  ? "bg-gradient-to-b from-green-400 to-green-600"
                  : "bg-gradient-to-b from-red-400 to-red-600"
                  }`}
              />

              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="pl-2">
                    <h3 className="text-xl font-bold text-slate-800">Room No: {room.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-600 backdrop-blur-sm">
                        {room.roomType}
                      </span>
                      <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-600 backdrop-blur-sm">
                        {room.occupancy} {room.occupancy === 1 ? "person" : "people"}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${isOccupied
                      ? "bg-green-500/20 text-green-700 ring-1 ring-green-500/30"
                      : "bg-red-500/10 text-red-700 ring-1 ring-red-400/30"
                      }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${isOccupied ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"
                        }`}
                    />
                    {isOccupied ? "Occupied" : "Available"}
                  </div>
                </div>

                {/* Room details card */}
                <div
                  className={`overflow-hidden rounded-2xl border bg-white/50 p-4 backdrop-blur-sm ${isOccupied ? "border-green-200/50" : "border-red-200/50"
                    }`}
                >
                  {room.booking ? (
                    <div className="space-y-3">
                      {/* Resident photo */}
                      <div className="relative mx-auto h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          alt={room.name}
                          className="object-cover"
                          fill
                          sizes="200px"
                          src={room.booking.photoUrl}
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <button
                          type="button"
                          className="absolute bottom-2 right-2 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-800 shadow-lg hover:bg-white"
                          onClick={() => setViewPhotoRoom(room)}
                        >
                          🔍 View Photo
                        </button>
                      </div>

                      {/* Contact info */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-slate-700">{room.booking.userName}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="font-medium text-slate-700">{room.booking.contactNumber}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-slate-600">Allocated: {formatDate(room.booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/80">
                        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-red-600">Room Available</p>
                      <p className="mt-1 text-xs text-red-500">Ready for allocation</p>
                    </div>
                  )}
                </div>

                {/* Room Actions */}
                <div className="mt-4">
                  <RoomActions room={room} currentUserId={currentUserId} userRole={userRole} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Photo View Modal */}
      {viewPhotoRoom && viewPhotoRoom.booking && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4" onClick={() => setViewPhotoRoom(null)}>
          <div
            className="relative flex h-[80vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -right-4 -top-4 z-50 rounded-full bg-white p-2 text-2xl text-slate-800 hover:bg-slate-100 shadow-lg"
              onClick={() => setViewPhotoRoom(null)}
              style={{ zIndex: 100 }}
            >
              ✕
            </button>
            <div className="relative h-full w-full">
              <Image
                alt={`${viewPhotoRoom.name} - ${viewPhotoRoom.booking.userName}`}
                className="rounded-2xl object-contain"
                fill
                sizes="90vw"
                src={viewPhotoRoom.booking.photoUrl}
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
