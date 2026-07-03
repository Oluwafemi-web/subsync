"use server";

import { cookies } from "next/headers";
import { login, signup } from "@/lib/mock-api";
import type { TLoginFormValues, TSignupPayload } from "@/lib/auth/schemas";
import {
  ONBOARDING_COOKIE,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import type { IAuthActionState } from "@/components/auth/LoginForm/@types";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const DEMO_EMAIL = "demo@subsync.ng";

async function createSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  if (email === DEMO_EMAIL) {
    cookieStore.set(ONBOARDING_COOKIE, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  } else {
    cookieStore.delete(ONBOARDING_COOKIE);
  }
}

export async function loginAction(
  values: TLoginFormValues,
  _redirectTo?: string
): Promise<IAuthActionState | void> {
  const result = await login(values.email, values.password);

  if (!result.success) {
    return { error: result.error ?? "Unable to sign in" };
  }

  await createSession(values.email);
}

export async function signupAction(
  values: TSignupPayload,
  _redirectTo?: string
): Promise<IAuthActionState | void> {
  const result = await signup(values);

  if (!result.success) {
    return { error: result.error ?? "Unable to create account" };
  }

  await createSession(values.email);
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(ONBOARDING_COOKIE);
}
