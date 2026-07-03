"use server";

import { cookies } from "next/headers";
import { login, signup } from "@/lib/mock-api";
import type { TLoginFormValues, TSignupFormValues } from "@/lib/auth/schemas";
import { SESSION_COOKIE } from "@/lib/auth/session";
import type { IAuthActionState } from "@/components/auth/LoginForm/@types";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

async function createSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
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
  values: TSignupFormValues,
  _redirectTo?: string
): Promise<IAuthActionState | void> {
  const result = await signup(values.name, values.email, values.password);

  if (!result.success) {
    return { error: result.error ?? "Unable to create account" };
  }

  await createSession(values.email);
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
