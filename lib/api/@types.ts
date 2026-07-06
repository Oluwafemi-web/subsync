export interface IApiMeta {
  request_id: string;
  page?: number;
  per_page?: number;
  total?: number;
}

export interface IApiErrorBody {
  code: string;
  message: string;
}

export interface IApiEnvelope<T> {
  data: T | null;
  meta?: IApiMeta;
  error?: IApiErrorBody | null;
}

export interface IApiUser {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
}

export interface IApiTenant {
  id: string;
  name: string;
  email?: string;
}

export interface IApiNombaInfo {
  webhook_url: string;
}

export interface IApiAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: string;
}

export interface IApiLoginResponse extends IApiAuthTokens {
  user: IApiUser;
  tenant: IApiTenant;
}

export interface IApiRegisterResponse extends IApiLoginResponse {
  api_key: string;
  nomba: IApiNombaInfo;
}

export type TApiPlanInterval = "monthly" | "annual" | "custom";

export interface IApiRegisterRequest {
  email: string;
  password: string;
  name: string;
  nomba_client_id: string;
  nomba_client_secret: string;
  nomba_account_id: string;
  nomba_sub_account_id?: string;
  nomba_env: "sandbox" | "production";
  nomba_webhook_secret?: string;
}

export interface IApiLoginRequest {
  email: string;
  password: string;
}

export type TApiRequestOptions = RequestInit & {
  auth?: boolean;
  skipRefresh?: boolean;
};
