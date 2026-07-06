"use server";

import {
  clearAuthSessionCookie,
  setAuthSessionCookie,
} from "@/lib/auth/session";

export async function establishAuthSessionAction(): Promise<void> {
  await setAuthSessionCookie();
}

export async function clearAuthSessionAction(): Promise<void> {
  await clearAuthSessionCookie();
}
