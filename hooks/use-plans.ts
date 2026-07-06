import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  archivePlan,
  createPlan,
  getPlan,
  getPlanStats,
  getPlansPaginated,
  updatePlan,
} from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import type { ICreatePlanInput, IPlanFilters, IUpdatePlanInput } from "@/types";

export function usePlans(filters: IPlanFilters = {}) {
  return useQuery({
    queryKey: queryKeys.plans.list(filters as Record<string, unknown>),
    queryFn: () => getPlansPaginated(filters),
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

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreatePlanInput) => createPlan(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useUpdatePlan(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IUpdatePlanInput) => updatePlan(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.detail(id) });
    },
  });
}

export function useArchivePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archivePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}
