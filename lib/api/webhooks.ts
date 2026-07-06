import { apiListRequest, apiRequest, apiRequestVoid } from "@/lib/api/client";
import { buildQuery } from "@/lib/api/query";
import {
  mapWebhookDelivery,
  mapWebhookEndpoint,
} from "@/lib/api/resource-mappers";
import type {
  IApiWebhookDelivery,
  IApiWebhookEndpoint,
} from "@/lib/api/@types";
import type {
  ICreateWebhookInput,
  IUpdateWebhookInput,
  IWebhookDelivery,
  IWebhookEndpoint,
} from "@/types";

export async function fetchWebhooks(): Promise<IWebhookEndpoint[]> {
  const { data } = await apiListRequest<IApiWebhookEndpoint[]>(
    `/webhook-endpoints${buildQuery({ per_page: 100 })}`
  );

  return (data ?? []).map(mapWebhookEndpoint);
}

export async function fetchWebhook(id: string): Promise<IWebhookEndpoint | null> {
  try {
    const data = await apiRequest<IApiWebhookEndpoint>(
      `/webhook-endpoints/${id}`
    );
    return mapWebhookEndpoint(data);
  } catch {
    return null;
  }
}

export async function fetchWebhookDeliveries(
  endpointId: string
): Promise<IWebhookDelivery[]> {
  const data = await apiRequest<IApiWebhookDelivery[]>(
    `/webhook-endpoints/${endpointId}/deliveries`
  );

  return (data ?? []).map(mapWebhookDelivery);
}

export async function createWebhookEndpoint(
  input: ICreateWebhookInput
): Promise<IWebhookEndpoint> {
  const data = await apiRequest<IApiWebhookEndpoint>("/webhook-endpoints", {
    method: "POST",
    body: JSON.stringify({
      url: input.url,
      events: input.events,
      is_active: input.isActive ?? true,
    }),
  });
  return mapWebhookEndpoint(data);
}

export async function updateWebhookEndpoint(
  id: string,
  input: IUpdateWebhookInput
): Promise<IWebhookEndpoint> {
  const data = await apiRequest<IApiWebhookEndpoint>(
    `/webhook-endpoints/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        url: input.url,
        events: input.events,
        is_active: input.isActive ?? true,
      }),
    }
  );
  return mapWebhookEndpoint(data);
}

export async function deleteWebhookEndpoint(id: string): Promise<void> {
  await apiRequestVoid(`/webhook-endpoints/${id}`, { method: "DELETE" });
}
