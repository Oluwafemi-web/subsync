export const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"] as const;

export const DEFAULT_AUTH_ROUTE = "/login";

export const DEFAULT_PROTECTED_ROUTE = "/dashboard";

export const PROTECTED_ROUTE_PREFIX = "/dashboard";

export type TAuthRoute = (typeof AUTH_ROUTES)[number];

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isProtectedRoute(pathname: string): boolean {
  return (
    pathname === PROTECTED_ROUTE_PREFIX ||
    pathname.startsWith(`${PROTECTED_ROUTE_PREFIX}/`)
  );
}
