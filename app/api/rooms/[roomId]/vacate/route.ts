import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";

export async function POST(request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  const auth = await requireRequestRole(request, ["admin", "user"]);
  if (auth.error) {
    return auth.error;
  }

  const { roomId } = await params;

  try {
    await connectToDatabase();

    // Find the booking for this room
    const booking = await Booking.findOne({ roomId, status: "active" });

    if (!booking) {
      return fail("No active booking found for this room", 404);
    }

    // Check if the logged-in user created this booking
    if (String(booking.userId) !== String(auth.session!.userId) && auth.session!.role !== "admin") {
      return fail("You can only vacate rooms you booked", 403);
    }

    // Update booking status to cancelled
    await Booking.findByIdAndUpdate(booking._id, { status: "cancelled" });

    // Update room status to available
    await Room.findByIdAndUpdate(roomId, { status: "available" });

    return ok({ success: true, message: "Room vacated successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to vacate room";
    return fail(message, 400);
  }
}
