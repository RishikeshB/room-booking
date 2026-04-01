import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await requireRequestRole(request, ["admin"]);
  if (auth.error) {
    return auth.error;
  }

  const { userId } = await params;
  const body = await request.json();

  await connectToDatabase();
  const user = await User.findById(userId);

  if (!user) {
    return fail("User not found", 404);
  }

  if (body.username) {
    user.username = body.username;
  }

  if (body.password) {
    user.password = body.password;
  }

  if (body.role) {
    user.role = body.role;
  }

  await user.save();
  return ok({ user: { _id: user._id, username: user.username, role: user.role } });
}

