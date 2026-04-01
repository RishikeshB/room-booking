import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { hotelSchema, parseWithSchema } from "@/lib/validation";
import { Hotel } from "@/models/Hotel";

export async function GET(request: NextRequest) {
  const auth = await requireRequestRole(request, ["admin", "user"]);
  if (auth.error) {
    return auth.error;
  }

  await connectToDatabase();
  const hotels = await Hotel.find().sort({ createdAt: -1 }).lean();
  return ok({ hotels });
}

export async function POST(request: NextRequest) {
  const auth = await requireRequestRole(request, ["admin"]);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = parseWithSchema(hotelSchema, body);

  if (!parsed.success) {
    return fail("Invalid hotel payload", 400, parsed.errors);
  }

  await connectToDatabase();
  const hotel = await Hotel.create(parsed.data);
  return ok({ hotel }, 201);
}

