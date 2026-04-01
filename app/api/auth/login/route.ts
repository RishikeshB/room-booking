import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { createSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ensureDefaultAdmin } from "@/lib/repositories";
import { parseWithSchema, loginSchema } from "@/lib/validation";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = parseWithSchema(loginSchema, body);

  if (!parsed.success) {
    return fail("Invalid login payload", 400, parsed.errors);
  }

  await connectToDatabase();
  await ensureDefaultAdmin();

  const user = await User.findOne({ username: parsed.data.username });
  if (!user) {
    return fail("Invalid username or password", 401);
  }

  const passwordMatches = await user.comparePassword(parsed.data.password);
  if (!passwordMatches) {
    return fail("Invalid username or password", 401);
  }

  await createSessionCookie({
    userId: String(user._id),
    username: user.username,
    role: user.role
  });

  return ok({ user: { _id: String(user._id), username: user.username, role: user.role } });
}

