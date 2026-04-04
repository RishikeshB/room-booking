"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BED_SIZES, ROOM_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type Room = {
  _id: string;
  name: string;
  roomType: string;
  occupancy: number;
  status: "available" | "occupied";
  booking?: {
    _id?: string;
    userName: string;
    userId: string;
    contactNumber: string;
    photoUrl: string;
    createdAt: string;
  };
};

type BookingHistory = {
  _id: string;
  userName: string;
  contactNumber: string;
  photoUrl: string;
  createdAt: string;
  status: "active" | "cancelled";
};

export function RoomActions({ room, currentUserId, userRole }: { room: Room; currentUserId: string; userRole: string }) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [vacating, setVacating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [history, setHistory] = useState<BookingHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [editForm, setEditForm] = useState({
    name: room.name,
    roomType: room.roomType,
    occupancy: room.occupancy
  });

  const canVacate = room.booking && (room.booking.userId === currentUserId || userRole === "admin");

  console.log('RoomActions - room:', room.name, 'userRole:', userRole, 'currentUserId:', currentUserId, 'canVacate:', canVacate);

  async function handleVacate() {
    if (!confirm(`Are you sure you want to vacate ${room.name}?`)) {
      return;
    }

    setVacating(true);

    try {
      const response = await fetch(`/api/rooms/${room._id}/vacate`, { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Failed to vacate room");
        return;
      }

      toast.success("Room vacated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to vacate room");
    } finally {
      setVacating(false);
    }
  }

  async function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEditing(true);

    try {
      const response = await fetch(`/api/rooms/${room._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Failed to update room");
        return;
      }

      toast.success("Room updated successfully");
      setShowEditModal(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update room");
    } finally {
      setEditing(false);
    }
  }

  async function handleFetchHistory() {
    setLoadingHistory(true);

    try {
      const response = await fetch(`/api/rooms/${room._id}/history`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Failed to fetch history");
        return;
      }

      setHistory(data.bookings);
    } catch (error) {
      toast.error("Failed to fetch history");
    } finally {
      setLoadingHistory(false);
    }
  }

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {userRole === "admin" && (
          <Button
            type="button"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => {
              setEditForm({ name: room.name, roomType: room.roomType, occupancy: room.occupancy });
              setShowEditModal(true);
            }}
          >
            ✏️ Edit
          </Button>
        )}

        {canVacate && room.status === "occupied" && (
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 text-xs"
            disabled={vacating}
            onClick={handleVacate}
          >
            {vacating ? "Vacating..." : "🚪 Vacate"}
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          className="flex-1 text-xs"
          onClick={() => {
            handleFetchHistory();
            setShowHistoryModal(true);
          }}
        >
          📋 History
        </Button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4" onClick={() => setShowEditModal(false)}>
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800">Edit {room.name}</h3>
              <button type="button" className="text-2xl text-slate-400 hover:text-slate-600" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>
            <form className="space-y-4 max-h-[20vh] overflow-y-auto p-6" onSubmit={handleEdit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Room name</label>
                <Input value={editForm.name} onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Room type</label>
                <Select value={editForm.roomType} onChange={(event) => setEditForm((current) => ({ ...current, roomType: event.target.value }))}>
                  {ROOM_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Occupancy</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={editForm.occupancy}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      const numValue = parseInt(value) || 1;
                      setEditForm((current) => ({ ...current, occupancy: Math.min(10, Math.max(1, numValue)) }));
                    }
                  }}
                  placeholder="1-10"
                />
              </div>
              <div className="sticky bottom-0 flex gap-3 border-t border-slate-100 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={editing}>
                  {editing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4" onClick={() => setShowHistoryModal(false)}>
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Booking History - {room.name}</h3>
              <button className="text-2xl text-slate-400 hover:text-slate-600" onClick={() => setShowHistoryModal(false)}>
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {loadingHistory ? (
                <p className="text-center text-sm text-slate-500">Loading history...</p>
              ) : history.length === 0 ? (
                <p className="text-center text-sm text-slate-500">No booking history available.</p>
              ) : (
                history.map((booking, index) => (
                  <div
                    key={booking._id}
                    className={`rounded-2xl border p-4 ${booking.status === "active" ? "border-green-200 bg-green-50/50" : "border-slate-200 bg-slate-50"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                          {booking.photoUrl ? (
                            <img alt={booking.userName} className="h-full w-full object-cover" src={booking.photoUrl} />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{booking.userName}</p>
                          <p className="text-sm text-slate-600">{booking.contactNumber}</p>
                          <p className="mt-1 text-xs text-slate-500">Booked: {formatDate(booking.createdAt)}</p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${booking.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                          }`}
                      >
                        {booking.status === "active" ? "Active" : booking.createdAt ? "Vacated" : "Cancelled"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="button" variant="outline" onClick={() => setShowHistoryModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
