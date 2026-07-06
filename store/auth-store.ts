import { create } from "zustand";
import type { IAuthSession, IUser } from "@/types";

interface IAuthState {
  accessToken: string | null;
  expiresAt: string | null;
  user: IUser | null;
  setSession: (session: IAuthSession) => void;
  setTokens: (accessToken: string, expiresAt: string) => void;
  setUser: (user: IUser) => void;
  clearSession: () => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<IAuthState>((set, get) => ({
  accessToken: null,
  expiresAt: null,
  user: null,
  setSession: (session) =>
    set({
      accessToken: session.accessToken,
      expiresAt: session.expiresAt,
      user: session.user,
    }),
  setTokens: (accessToken, expiresAt) =>
    set({
      accessToken,
      expiresAt,
    }),
  setUser: (user) => set({ user }),
  clearSession: () =>
    set({
      accessToken: null,
      expiresAt: null,
      user: null,
    }),
  isTokenExpired: () => {
    const { expiresAt } = get();
    if (!expiresAt) {
      return true;
    }

    return Date.now() >= new Date(expiresAt).getTime();
  },
}));

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}
