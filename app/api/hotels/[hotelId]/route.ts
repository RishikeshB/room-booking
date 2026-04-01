import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { hotelSchema, parseWithSchema } from "@/lib/validation";
import { Hotel } from "@/models/Hotel";

export async function GET(request: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const auth = await requireRequestRole(request, ["admin", "user"]);
  if (auth.error) {
    return auth.error;
  }

  const { hotelId } = await params;
  await connectToDatabase();
  const hotel = await Hotel.findById(hotelId).lean();

  if (!hotel) {
    return fail("Hotel not found", 404);
  }

  return ok({ hotel });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const auth = await requireRequestRole(request, ["admin"]);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = parseWithSchema(hotelSchema, body);

  if (!parsed.success) {
    return fail("Invalid hotel payload", 400, parsed.errors);
  }

  const { hotelId } = await params;
  await connectToDatabase();
  const hotel = await Hotel.findByIdAndUpdate(hotelId, parsed.data, { new: true }).lean();

  if (!hotel) {
    return fail("Hotel not found", 404);
  }

  return ok({ hotel });
}

