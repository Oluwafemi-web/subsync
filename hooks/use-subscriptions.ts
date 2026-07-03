import { useQuery } from "@tanstack/react-query";
import {
  getSubscription,
  getSubscriptions,
  getSubscriptionTransitions,
} from "@/lib/mock-api";
import { queryKeys } from "@/lib/query-keys";
import type { ISubscriptionFilters } from "@/types";

export function useSubscriptions(filters: ISubscriptionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.subscriptions.list(
      filters as Record<string, unknown>
    ),
    queryFn: () => getSubscriptions(filters),
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.detail(id),
    queryFn: () => getSubscription(id),
    enabled: Boolean(id),
  });
}

export function useSubscriptionTransitions(id: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.transitions(id),
    queryFn: () => getSubscriptionTransitions(id),
    enabled: Boolean(id),
  });
}
