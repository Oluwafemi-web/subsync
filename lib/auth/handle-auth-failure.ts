import { clearAuthSessionAction } from "@/app/actions/auth";
import { ApiError } from "@/lib/api/errors";
import { isAuthRoute } from "@/lib/auth/routes";
import { useAuthStore } from "@/store/auth-store";

let authFailureInProgress = false;

export function handleAuthFailure(): never {
  useAuthStore.getState().clearSession();

  if (
    typeof window !== "undefined" &&
    !isAuthRoute(window.location.pathname) &&
    !authFailureInProgress
  ) {
    authFailureInProgress = true;

    // Clear the httpOnly session cookie before redirecting so proxy.ts
    // doesn't immediately bounce the user back to /dashboard.
    void clearAuthSessionAction().finally(() => {
      window.location.assign("/login");
    });
  }

  throw new ApiError(
    "unauthorized",
    "Your session has expired. Please sign in again.",
    401
  );
}
