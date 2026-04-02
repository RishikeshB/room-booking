import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { User } from "@/models/User";

export async function GET(request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  const auth = await requireRequestRole(request, ["admin", "user"]);
  if (auth.error) {
    return auth.error;
  }

  const { roomId } = await params;

  try {
    await connectToDatabase();

    const bookings = await Booking.find({ roomId })
      .sort({ createdAt: -1 })
      .populate("userId", "username")
      .lean();

    // Add userName from User model if not already in booking
    const bookingsWithUser = await Promise.all(
      bookings.map(async (booking) => {
        const user = booking.userId as unknown as { _id: string; username: string } | null;
        return {
          ...booking,
          userName: booking.userName || user?.username || "Unknown",
          userId: String(booking.userId)
        };
      })
    );

    return ok({ bookings: bookingsWithUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch booking history";
    return fail(message, 400);
  }
}
