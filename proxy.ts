import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_AUTH_ROUTE,
  DEFAULT_PROTECTED_ROUTE,
  isAuthRoute,
  isProtectedRoute,
} from "@/lib/auth/routes";
import { SESSION_COOKIE } from "@/lib/auth/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const isAuthenticated = Boolean(session);

  if (pathname === "/") {
    const destination = isAuthenticated
      ? DEFAULT_PROTECTED_ROUTE
      : DEFAULT_AUTH_ROUTE;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL(DEFAULT_AUTH_ROUTE, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_PROTECTED_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};
