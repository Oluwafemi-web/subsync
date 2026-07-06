import { useQuery } from "@tanstack/react-query";
import {
  getOverviewMetrics,
  getRecentActivity,
  getRevenueChart,
  getSubscriptionBreakdown,
} from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import type { IAnalyticsDateRange } from "@/types";

export function useOverviewMetrics(range: IAnalyticsDateRange) {
  return useQuery({
    queryKey: queryKeys.overview.metrics(range),
    queryFn: () => getOverviewMetrics(range),
  });
}

export function useRevenueChart(range: IAnalyticsDateRange) {
  return useQuery({
    queryKey: queryKeys.overview.revenue(range),
    queryFn: () => getRevenueChart(range),
  });
}

export function useSubscriptionBreakdown() {
  return useQuery({
    queryKey: queryKeys.overview.breakdown,
    queryFn: getSubscriptionBreakdown,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: queryKeys.overview.activity,
    queryFn: getRecentActivity,
  });
}
