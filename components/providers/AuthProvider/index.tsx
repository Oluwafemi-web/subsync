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

export function AuthProvider({ children }: IAuthProviderProps) {
  const pathname = usePathname();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    if (isAuthRoute(pathname)) {
      return;
    }

    let cancelled = false;

    async function hydrateSession() {
      if (accessToken && expiresAt) {
        return;
      }

      const session = await restoreSession();

      if (cancelled) {
        return;
      }

      if (session) {
        setSession(session);
      } else {
        clearSession();
      }
    }

    void hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [pathname, accessToken, expiresAt, setSession, clearSession]);

  useEffect(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!expiresAt || isAuthRoute(pathname)) {
      return;
    }

    const refreshAt =
      new Date(expiresAt).getTime() - REFRESH_BUFFER_MS - Date.now();

    refreshTimerRef.current = setTimeout(
      () => {
        void refreshAccessToken().catch(() => {
          handleAuthFailure();
        });
      },
      Math.max(refreshAt, 0)
    );

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [expiresAt, pathname, clearSession]);

  return children;
}
