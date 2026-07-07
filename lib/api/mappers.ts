import type {
  IApiAuthTokens,
  IApiLoginResponse,
  IApiRegisterResponse,
  IApiUser,
} from "@/lib/api/@types";
import type { IAuthSession, ILoginResult, IRegisterResult, IUser } from "@/types";

export function mapUser(apiUser: IApiUser): IUser {
  return {
    id: apiUser.id,
    tenantId: apiUser.tenant_id,
    email: apiUser.email,
    name: apiUser.name,
  };
}

export function mapAuthSession(
  response: IApiLoginResponse | IApiRegisterResponse
): IAuthSession {
  return {
    accessToken: response.access_token,
    expiresAt: response.expires_at,
    user: mapUser(response.user),
  };
}

export function mapLoginResult(response: IApiLoginResponse): ILoginResult {
  return {
    session: mapAuthSession(response),
    nombaWebhookUrl: response.nomba.webhook_url,
  };
}

export function mapRegisterResult(response: IApiRegisterResponse): IRegisterResult {
  return {
    ...mapLoginResult(response),
    apiKey: response.api_key,
  };
}

export function mapRefreshTokens(tokens: IApiAuthTokens): Pick<IAuthSession, "accessToken" | "expiresAt"> {
  return {
    accessToken: tokens.access_token,
    expiresAt: tokens.expires_at,
  };
}
