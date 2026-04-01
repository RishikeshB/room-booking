import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Room } from "@/models/Room";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  const auth = await requireRequestRole(request, ["admin"]);
  if (auth.error) {
    return auth.error;
  }

  const { roomId } = await params;
  const body = await request.json();

  await connectToDatabase();
  const room = await Room.findByIdAndUpdate(roomId, body, { new: true }).lean();

  if (!room) {
    return fail("Room not found", 404);
  }

  return ok({ room });
}

