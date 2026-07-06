import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buildPortalUrl,
  cancelSubscription,
  createPortalToken,
  getProrationEstimate,
  getSubscription,
  getSubscriptions,
  getSubscriptionTransitions,
  pauseSubscription,
  resumeCheckout,
  resumeSubscription,
  startCheckout,
  upgradeSubscription,
} from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import type { ICheckoutInput, ISubscriptionFilters } from "@/types";

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
    refetchInterval: (query) => {
      const subscription = query.state.data;
      if (subscription?.state === "incomplete") {
        return 10_000;
      }
      return false;
    },
    refetchIntervalInBackground: true,
  });
}

export function useSubscriptionTransitions(id: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.transitions(id),
    queryFn: () => getSubscriptionTransitions(id),
    enabled: Boolean(id),
  });
}

export function useStartCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICheckoutInput) => startCheckout(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

export function useResumeCheckout(subscriptionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICheckoutInput) =>
      resumeCheckout(subscriptionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.detail(subscriptionId),
      });
    },
  });
}

export function useCancelSubscription(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cancelAtPeriodEnd,
      reason,
    }: {
      cancelAtPeriodEnd: boolean;
      reason?: string;
    }) => cancelSubscription(id, cancelAtPeriodEnd, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.detail(id),
      });
    },
  });
}

export function usePauseSubscription(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pauseEndsAt?: string) => pauseSubscription(id, pauseEndsAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.detail(id),
      });
    },
  });
}

export function useResumeSubscription(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resumeSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.detail(id),
      });
    },
  });
}

export function useUpgradeSubscription(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPlanId: string) => upgradeSubscription(id, newPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.detail(id),
      });
    },
  });
}

export function useUpgradePreview(id: string, newPlanId: string) {
  return useQuery({
    queryKey: ["subscriptions", id, "upgrade-preview", newPlanId],
    queryFn: () => getProrationEstimate(id, newPlanId),
    enabled: Boolean(id && newPlanId),
  });
}

export function useCreatePortalToken(subscriptionId: string) {
  return useMutation({
    mutationFn: () => createPortalToken(subscriptionId),
  });
}

export { buildPortalUrl };
