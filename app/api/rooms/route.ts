import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { roomSchema, parseWithSchema } from "@/lib/validation";
import { Room } from "@/models/Room";

export async function GET(request: NextRequest) {
  const auth = await requireRequestRole(request, ["admin", "user"]);
  if (auth.error) {
    return auth.error;
  }

  await connectToDatabase();
  const rooms = await Room.find().sort({ createdAt: -1 }).lean();
  return ok({ rooms });
}

export async function POST(request: NextRequest) {
  const auth = await requireRequestRole(request, ["admin"]);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = parseWithSchema(roomSchema, body);

  if (!parsed.success) {
    return fail("Invalid room payload", 400, parsed.errors);
  }

  await connectToDatabase();
  const room = await Room.create(parsed.data);
  return ok({ room }, 201);
}

