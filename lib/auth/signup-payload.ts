import type { TSignupPayload } from "@/lib/auth/schemas";

export function buildSignupPayload(values: TSignupPayload): TSignupPayload {
  const payload: TSignupPayload = { ...values };

  if (!payload.nomba_sub_account_id?.trim()) {
    delete payload.nomba_sub_account_id;
  }

  return payload;
}
