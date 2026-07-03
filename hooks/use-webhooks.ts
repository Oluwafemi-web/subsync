import { useQuery } from "@tanstack/react-query";
import {
  getWebhook,
  getWebhookDeliveries,
  getWebhooks,
} from "@/lib/mock-api";
import { queryKeys } from "@/lib/query-keys";

export function useWebhooks() {
  return useQuery({
    queryKey: queryKeys.webhooks.all,
    queryFn: getWebhooks,
  });
}

export function useWebhook(id: string) {
  return useQuery({
    queryKey: queryKeys.webhooks.detail(id),
    queryFn: () => getWebhook(id),
    enabled: Boolean(id),
  });
}

export function useWebhookDeliveries(endpointId: string) {
  return useQuery({
    queryKey: queryKeys.webhooks.deliveries(endpointId),
    queryFn: () => getWebhookDeliveries(endpointId),
    enabled: Boolean(endpointId),
  });
}
