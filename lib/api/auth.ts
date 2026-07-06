import type {
  IApiConfirmPasswordOtpRequest,
  IApiConfirmPasswordOtpResponse,
  IApiForgotPasswordRequest,
  IApiForgotPasswordResponse,
  IApiLoginRequest,
  IApiLoginResponse,
  IApiRegisterRequest,
  IApiRegisterResponse,
  IApiResetPasswordRequest,
  IApiUser,
} from "@/lib/api/@types";
import { apiRequest, apiRequestVoid, refreshAccessToken } from "@/lib/api/client";
import { getErrorMessage } from "@/lib/api/errors";
import {
  mapAuthSession,
  mapRegisterResult,
  mapUser,
} from "@/lib/api/mappers";
import type {
  TForgotPasswordEmailValues,
  TForgotPasswordOtpValues,
  TLoginFormValues,
  TResetPasswordValues,
  TSignupPayload,
} from "@/lib/auth/schemas";
import { useAuthStore } from "@/store/auth-store";
import type { IAuthSession, IRegisterResult, IUser } from "@/types";

function mapSignupPayload(values: TSignupPayload): IApiRegisterRequest {
  return {
    email: values.email,
    password: values.password,
    name: values.name,
    nomba_client_id: values.nomba_client_id,
    nomba_client_secret: values.nomba_client_secret,
    nomba_account_id: values.nomba_account_id,
    nomba_sub_account_id: values.nomba_sub_account_id ?? "",
    nomba_env: values.nomba_env,
    nomba_webhook_secret: values.nomba_webhook_secret ?? "",
  };
}

export async function login(values: TLoginFormValues): Promise<IAuthSession> {
  const body: IApiLoginRequest = {
    email: values.email,
    password: values.password,
  };

  const response = await apiRequest<IApiLoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    auth: false,
  });

  return mapAuthSession(response);
}

export async function register(values: TSignupPayload): Promise<IRegisterResult> {
  const response = await apiRequest<IApiRegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(mapSignupPayload(values)),
    auth: false,
  });

  return mapRegisterResult(response);
}

export async function logout(): Promise<void> {
  try {
    await apiRequestVoid("/auth/logout", { method: "POST" });
  } catch {
    // Clear local session even if the API call fails.
  }
}

export async function getMe(): Promise<IUser> {
  const response = await apiRequest<IApiUser>("/me");
  return mapUser(response);
}

export async function forgotPassword(
  values: TForgotPasswordEmailValues
): Promise<IApiForgotPasswordResponse> {
  const body: IApiForgotPasswordRequest = { email: values.email };

  return apiRequest<IApiForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(body),
    auth: false,
  });
}

export async function confirmPasswordOtp(
  email: string,
  values: TForgotPasswordOtpValues
): Promise<string> {
  const body: IApiConfirmPasswordOtpRequest = {
    email,
    otp: values.otp,
  };

  const response = await apiRequest<IApiConfirmPasswordOtpResponse>(
    "/auth/confirm-password-otp",
    {
      method: "POST",
      body: JSON.stringify(body),
      auth: false,
    }
  );

  return response.reset_token;
}

export async function resetPassword(
  resetToken: string,
  values: TResetPasswordValues
): Promise<void> {
  const body: IApiResetPasswordRequest = {
    token: resetToken,
    new_password: values.password,
  };

  await apiRequestVoid("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
    auth: false,
  });
}

export async function restoreSession(): Promise<IAuthSession | null> {
  try {
    await refreshAccessToken();
    const user = await getMe();
    const { accessToken, expiresAt } = useAuthStore.getState();

    if (!accessToken || !expiresAt) {
      return null;
    }

    return { accessToken, expiresAt, user };
  } catch {
    return null;
  }
}

export { getErrorMessage };
