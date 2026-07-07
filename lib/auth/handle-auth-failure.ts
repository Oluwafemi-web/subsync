import { ApiError } from "@/lib/api/errors";
import { isAuthRoute } from "@/lib/auth/routes";
import { useAuthStore } from "@/store/auth-store";

export function handleAuthFailure(): never {
  useAuthStore.getState().clearSession();

  if (typeof window !== "undefined" && !isAuthRoute(window.location.pathname)) {
    window.location.assign("/login");
  }

  throw new ApiError(
    "unauthorized",
    "Your session has expired. Please sign in again.",
    401
  );
}
