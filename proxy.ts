import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/procedures" && searchParams.has("category")) {
    return NextResponse.redirect(new URL("/procedures", request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/procedures",
};
