"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { TBusinessDetailsValues } from "@/lib/auth/schemas";
import {
  AUTH_SESSION_COOKIE,
  ONBOARDING_COOKIE,
} from "@/lib/auth/session";
import { generateApiKey } from "@/lib/mock-api";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function completeOnboardingAction(
  businessDetails: TBusinessDetailsValues
): Promise<{ apiKey: string }> {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!session) {
    redirect("/login");
  }

  const apiKey = await generateApiKey();

  cookieStore.set(ONBOARDING_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  void businessDetails;

  return { apiKey };
}
