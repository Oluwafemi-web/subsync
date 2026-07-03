import { useQuery } from "@tanstack/react-query";
import { getPlan, getPlanStats, getPlans } from "@/lib/mock-api";
import { queryKeys } from "@/lib/query-keys";

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.plans.all,
    queryFn: getPlans,
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: queryKeys.plans.detail(id),
    queryFn: () => getPlan(id),
    enabled: Boolean(id),
  });
}

export function usePlanStats(id: string) {
  return useQuery({
    queryKey: queryKeys.plans.stats(id),
    queryFn: () => getPlanStats(id),
    enabled: Boolean(id),
  });
}
