import type { IApiEnvelope, IApiMeta, TApiRequestOptions } from "@/lib/api/@types";
import { ApiError } from "@/lib/api/errors";
import { getAccessToken, useAuthStore } from "@/store/auth-store";

const REFRESH_PATH = "/auth/refresh";

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new ApiError(
      "missing_config",
      "NEXT_PUBLIC_API_URL is not configured",
      0
    );
  }

  return baseUrl.replace(/\/$/, "");
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${normalizedPath}`;
}

function getDefaultHeaders(): Headers {
  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");
  headers.set("ngrok-skip-browser-warning", "true");
  return headers;
}

async function parseEnvelope<T>(response: Response): Promise<IApiEnvelope<T>> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new ApiError(
      "invalid_response",
      `Unexpected response type (${response.status})`,
      response.status
    );
  }

  return (await response.json()) as IApiEnvelope<T>;
}

function throwApiError(
  envelope: IApiEnvelope<unknown>,
  status: number
): never {
  throw new ApiError(
    envelope.error?.code ?? "unknown_error",
    envelope.error?.message ?? "Request failed",
    status
  );
}

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(buildUrl(REFRESH_PATH), {
        method: "GET",
        credentials: "include",
        headers: getDefaultHeaders(),
      });

      const envelope = await parseEnvelope<{
        access_token: string;
        expires_at: string;
      }>(response);

      if (!response.ok || envelope.error || !envelope.data) {
        useAuthStore.getState().clearSession();
        throwApiError(envelope, response.status);
      }

      useAuthStore
        .getState()
        .setTokens(envelope.data.access_token, envelope.data.expires_at);
    })().finally(() => {
      refreshPromise = null;
    });
  }

  await refreshPromise;
}

async function apiFetch<T>(
  path: string,
  options: TApiRequestOptions = {}
): Promise<IApiEnvelope<T>> {
  const { auth = true, skipRefresh = false, headers, ...init } = options;
  const requestHeaders = new Headers(headers);

  for (const [key, value] of getDefaultHeaders().entries()) {
    if (!requestHeaders.has(key)) {
      requestHeaders.set(key, value);
    }
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: requestHeaders,
    credentials: "include",
  });

  const envelope = await parseEnvelope<T>(response);

  if (response.status === 401 && auth && !skipRefresh && path !== REFRESH_PATH) {
    await refreshAccessToken();
    return apiFetch<T>(path, { ...options, skipRefresh: true });
  }

  if (!response.ok || envelope.error) {
    throwApiError(envelope, response.status);
  }

  return envelope;
}

export async function apiRequest<T>(
  path: string,
  options: TApiRequestOptions = {}
): Promise<T> {
  const envelope = await apiFetch<T>(path, options);

  if (envelope.data === null) {
    throw new ApiError("empty_response", "Empty response from API", 200);
  }

  return envelope.data;
}

export async function apiListRequest<T>(
  path: string,
  options: TApiRequestOptions = {}
): Promise<{ data: T; meta: IApiMeta }> {
  const envelope = await apiFetch<T>(path, options);

  if (envelope.data === null) {
    throw new ApiError("empty_response", "Empty response from API", 200);
  }

  return {
    data: envelope.data,
    meta: envelope.meta ?? { request_id: "" },
  };
}

export async function apiRequestVoid(
  path: string,
  options: TApiRequestOptions = {}
): Promise<void> {
  const { auth = true, skipRefresh = false, headers, ...init } = options;
  const requestHeaders = new Headers(headers);

  for (const [key, value] of getDefaultHeaders().entries()) {
    if (!requestHeaders.has(key)) {
      requestHeaders.set(key, value);
    }
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: requestHeaders,
    credentials: "include",
  });

  if (response.status === 204) {
    return;
  }

  const envelope = await parseEnvelope<unknown>(response);

  if (response.status === 401 && auth && !skipRefresh && path !== REFRESH_PATH) {
    await refreshAccessToken();
    await apiRequestVoid(path, { ...options, skipRefresh: true });
    return;
  }

  if (!response.ok || envelope.error) {
    throwApiError(envelope, response.status);
  }
}

export { refreshAccessToken };
