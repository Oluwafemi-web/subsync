import { apiRequest } from "@/lib/api/client";
import type {
  IApiPortalTokenRequest,
  IApiPortalTokenResponse,
} from "@/lib/api/@types";
import type { IPortalTokenResult } from "@/types";

export async function createPortalToken(
  subscriptionId: string,
  expiresInHours = 72
): Promise<IPortalTokenResult> {
  const body: IApiPortalTokenRequest = {
    subscription_id: subscriptionId,
    expires_in_hours: expiresInHours,
  };

  const data = await apiRequest<IApiPortalTokenResponse>("/portal/token", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    token: data.token,
    expiresAt: data.expires_at,
  };
}

export function buildPortalUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, "");
  if (baseUrl) {
    return `${baseUrl}/portal/${token}`;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/portal/${token}`;
  }

  return `/portal/${token}`;
}
