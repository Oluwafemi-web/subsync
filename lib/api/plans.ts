import { DEFAULT_PAGE_SIZE } from "@/lib/api/config";
import { apiListRequest, apiRequest, apiRequestVoid } from "@/lib/api/client";
import { mapPaginatedResponse } from "@/lib/api/pagination";
import { buildQuery } from "@/lib/api/query";
import {
  mapPlan,
  mapPlanStats,
  toApiInterval,
  toMinorUnits,
} from "@/lib/api/resource-mappers";
import type { IApiPlan, IApiPlanStats } from "@/lib/api/@types";
import type {
  ICreatePlanInput,
  IPaginatedResponse,
  IPlan,
  IPlanStats,
  IUpdatePlanInput,
} from "@/types";

export interface IPlansListParams {
  page?: number;
  pageSize?: number;
}

export async function fetchPlans(
  params: IPlansListParams = {}
): Promise<IPaginatedResponse<IPlan>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  const { data, meta } = await apiListRequest<IApiPlan[]>(
    `/plans${buildQuery({ page, per_page: pageSize })}`
  );

  return mapPaginatedResponse(
    (data ?? []).map(mapPlan),
    meta,
    pageSize
  );
}

export async function fetchPlansList(
  params: IPlansListParams = {}
): Promise<IPlan[]> {
  const result = await fetchPlans(params);
  return result.data;
}

export async function fetchPlan(id: string): Promise<IPlan | null> {
  try {
    const data = await apiRequest<IApiPlan>(`/plans/${id}`);
    return mapPlan(data);
  } catch {
    return null;
  }
}

export async function fetchPlanStats(id: string): Promise<IPlanStats> {
  const data = await apiRequest<IApiPlanStats>(`/plans/${id}/stats`);
  return mapPlanStats(data);
}

function buildPlanBody(input: ICreatePlanInput) {
  return {
    name: input.name,
    description: input.description ?? "",
    amount: toMinorUnits(input.price),
    currency: "NGN",
    interval: toApiInterval(input.interval),
    interval_days:
      input.interval === "custom" ? input.customIntervalDays : undefined,
    trial_days: input.trialDays ?? 0,
    features: input.features ?? [],
  };
}

export async function createPlan(input: ICreatePlanInput): Promise<IPlan> {
  const data = await apiRequest<IApiPlan>("/plans", {
    method: "POST",
    body: JSON.stringify(buildPlanBody(input)),
  });
  return mapPlan(data);
}

export async function updatePlan(
  id: string,
  input: IUpdatePlanInput
): Promise<IPlan> {
  const data = await apiRequest<IApiPlan>(`/plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(buildPlanBody(input)),
  });
  return mapPlan(data);
}

export async function archivePlan(id: string): Promise<void> {
  await apiRequestVoid(`/plans/${id}`, { method: "DELETE" });
}
