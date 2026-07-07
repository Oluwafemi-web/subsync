import { useAuthStore } from "@/store/auth-store";

export function useIsAuthReady(): boolean {
  return useAuthStore((state) =>
    Boolean(state.accessToken && state.expiresAt)
  );
}
