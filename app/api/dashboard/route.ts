import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { getDashboardData } from "@/lib/repositories";

export async function GET(request: NextRequest) {
  const auth = await requireRequestRole(request, ["admin"]);
  if (auth.error) {
    return auth.error;
  }

  const hotels = await getDashboardData();
  return ok({ hotels });
}

