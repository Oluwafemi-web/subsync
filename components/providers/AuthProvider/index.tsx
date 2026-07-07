"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { restoreSession } from "@/lib/api/auth";
import { refreshAccessToken } from "@/lib/api/client";
import { isAuthRoute } from "@/lib/auth/routes";
import { handleAuthFailure } from "@/lib/auth/handle-auth-failure";
import { useAuthStore } from "@/store/auth-store";
import type { IAuthProviderProps } from "./@types";

const REFRESH_BUFFER_MS = 60_000;
const MIN_REFRESH_INTERVAL_MS = 10_000;

export function AuthProvider({ children }: IAuthProviderProps) {
  const pathname = usePathname();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRefreshAttemptRef = useRef(0);
  const hasHydratedRef = useRef(false);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    if (isAuthRoute(pathname)) {
      hasHydratedRef.current = false;
      return;
    }

    if (hasHydratedRef.current) {
      return;
    }

    let cancelled = false;

    async function hydrateSession() {
      const { accessToken, expiresAt: currentExpiry } = useAuthStore.getState();

      if (accessToken && currentExpiry) {
        hasHydratedRef.current = true;
        return;
      }

      const session = await restoreSession();

      if (cancelled) {
        return;
      }

      hasHydratedRef.current = true;

      if (session) {
        setSession(session);
        return;
      }

      // restoreSession may have refreshed tokens even when /me failed;
      // don't wipe a valid token and re-trigger hydration in a loop.
      const { accessToken: refreshedToken } = useAuthStore.getState();
      if (!refreshedToken) {
        clearSession();
      }
    }

    void hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [pathname, setSession, clearSession]);

  useEffect(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!expiresAt || isAuthRoute(pathname)) {
      return;
    }

    const expiresAtMs = new Date(expiresAt).getTime();
    if (Number.isNaN(expiresAtMs)) {
      return;
    }

    const refreshAt = expiresAtMs - REFRESH_BUFFER_MS - Date.now();
    const delay =
      refreshAt <= 0
        ? MIN_REFRESH_INTERVAL_MS
        : Math.max(refreshAt, MIN_REFRESH_INTERVAL_MS);

    refreshTimerRef.current = setTimeout(
      () => {
        const now = Date.now();
        if (now - lastRefreshAttemptRef.current < MIN_REFRESH_INTERVAL_MS) {
          return;
        }

        lastRefreshAttemptRef.current = now;

        void refreshAccessToken().catch(() => {
          handleAuthFailure();
        });
      },
      delay
    );

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [expiresAt, pathname, clearSession]);

  return children;
}
