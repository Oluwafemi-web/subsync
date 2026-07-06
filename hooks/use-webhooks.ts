import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWebhookEndpoint,
  deleteWebhookEndpoint,
  getWebhook,
  getWebhookDeliveries,
  getWebhooks,
  updateWebhookEndpoint,
} from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import type { ICreateWebhookInput, IUpdateWebhookInput } from "@/types";

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

export function useCreateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateWebhookInput) => createWebhookEndpoint(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.all });
    },
  });
}

export function useUpdateWebhook(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IUpdateWebhookInput) =>
      updateWebhookEndpoint(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.all });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWebhookEndpoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.all });
    },
  });
}
