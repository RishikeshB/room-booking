import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE } from "@/lib/constants";
import { verifyToken } from "@/lib/jwt";

const PROTECTED_PREFIXES = ["/book"];
const PUBLIC_ROUTES = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (PUBLIC_ROUTES.includes(pathname) && session) {
    return NextResponse.redirect(
      new URL(session.role === "admin" ? "/admin" : "/book", request.url)
    );
  }

  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"]
};

