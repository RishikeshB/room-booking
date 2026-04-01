import { destroySessionCookie } from "@/lib/auth";
import { ok } from "@/lib/api";

export async function POST() {
  await destroySessionCookie();
  return ok({ success: true });
}

