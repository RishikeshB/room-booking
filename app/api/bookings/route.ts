import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { bookingSchema, parseWithSchema } from "@/lib/validation";
import { createBooking } from "@/lib/repositories";

export async function POST(request: NextRequest) {
  const auth = await requireRequestRole(request, ["admin", "user"]);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = parseWithSchema(bookingSchema, body);

  if (!parsed.success) {
    return fail("Invalid booking payload", 400, parsed.errors);
  }

  try {
    const booking = await createBooking({ ...parsed.data, userId: auth.session!.userId });
    return ok({ booking }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking failed";
    return fail(message, 400);
  }
}

