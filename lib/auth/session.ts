import { cookies } from "next/headers";

export const AUTH_SESSION_COOKIE = "subsync_authenticated";
export const ONBOARDING_COOKIE = "subsync_onboarding_complete";

/** @deprecated Use AUTH_SESSION_COOKIE */
export const SESSION_COOKIE = AUTH_SESSION_COOKIE;

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_SESSION_COOKIE)?.value ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session);
}

export async function setAuthSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAuthSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_SESSION_COOKIE);
  cookieStore.delete(ONBOARDING_COOKIE);
}
