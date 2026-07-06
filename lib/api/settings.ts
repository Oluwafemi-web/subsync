import { apiRequest, apiRequestVoid } from "@/lib/api/client";
import { mapSettings } from "@/lib/api/resource-mappers";
import type {
  IApiNombaSettings,
  IApiRotateApiKeyResponse,
  IApiSettings,
} from "@/lib/api/@types";
import { getMe } from "@/lib/api/auth";
import type { TNombaSettingsValues, TGeneralSettingsValues } from "@/lib/schemas/dashboard";
import type { IDunningStep, ISettings } from "@/types";

export async function fetchSettings(): Promise<ISettings> {
  const [settings, nomba, user] = await Promise.all([
    apiRequest<IApiSettings>("/settings"),
    apiRequest<IApiNombaSettings>("/settings/nomba"),
    getMe(),
  ]);

  return mapSettings(settings, nomba, user.tenantId);
}

export async function updateGeneralSettings(
  values: TGeneralSettingsValues
): Promise<ISettings> {
  await apiRequest<IApiSettings>("/settings/general", {
    method: "PATCH",
    body: JSON.stringify({
      name: values.name,
      email: values.email,
      website: values.website ?? "",
    }),
  });
  return fetchSettings();
}

export async function updateNombaSettings(
  values: TNombaSettingsValues
): Promise<ISettings> {
  await apiRequest<IApiNombaSettings>("/settings/nomba", {
    method: "PATCH",
    body: JSON.stringify({
      nomba_client_id: values.clientId,
      nomba_client_secret: values.clientSecret,
      nomba_account_id: values.accountId,
      nomba_sub_account_id: values.subAccountId ?? "",
      nomba_env: values.env,
      nomba_webhook_secret: values.webhookSecret ?? "",
    }),
  });
  return fetchSettings();
}

export async function updateDunningSettings(
  steps: IDunningStep[]
): Promise<ISettings> {
  await apiRequest("/settings/dunning", {
    method: "PATCH",
    body: JSON.stringify({
      steps: steps.map((step) => ({
        delay_days: step.day,
        action: step.action,
      })),
    }),
  });
  return fetchSettings();
}

export async function rotateApiKey(): Promise<string> {
  const data = await apiRequest<IApiRotateApiKeyResponse>(
    "/settings/api-key/rotate",
    { method: "POST" }
  );
  return data.api_key;
}

export async function verifyNombaCredentials(
  _credentials?: unknown
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}
