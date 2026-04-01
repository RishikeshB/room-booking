import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { parseWithSchema, userSchema } from "@/lib/validation";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  const auth = await requireRequestRole(request, ["admin"]);
  if (auth.error) {
    return auth.error;
  }

  await connectToDatabase();
  const users = await User.find().sort({ createdAt: -1 }).select("username role").lean();
  return ok({ users });
}

export async function POST(request: NextRequest) {
  const auth = await requireRequestRole(request, ["admin"]);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = parseWithSchema(userSchema, body);

  if (!parsed.success) {
    return fail("Invalid user payload", 400, parsed.errors);
  }

  await connectToDatabase();

  const existing = await User.findOne({ username: parsed.data.username });
  if (existing) {
    return fail("Username already exists", 409);
  }

  const user = await User.create(parsed.data);
  return ok({ user: { _id: user._id, username: user.username, role: user.role } }, 201);
}

