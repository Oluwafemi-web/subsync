import { useQuery } from "@tanstack/react-query";
import { useIsAuthReady } from "@/hooks/use-auth-ready";
import {
  getOverviewMetrics,
  getRecentActivity,
  getRevenueChart,
  getSubscriptionBreakdown,
} from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import type { IAnalyticsDateRange } from "@/types";

export function useOverviewMetrics(range: IAnalyticsDateRange) {
  const isAuthReady = useIsAuthReady();

  return useQuery({
    queryKey: queryKeys.overview.metrics(range),
    queryFn: () => getOverviewMetrics(range),
    enabled: isAuthReady,
  });
}

export function useRevenueChart(range: IAnalyticsDateRange) {
  const isAuthReady = useIsAuthReady();

  return useQuery({
    queryKey: queryKeys.overview.revenue(range),
    queryFn: () => getRevenueChart(range),
    enabled: isAuthReady,
  });
}

export function useSubscriptionBreakdown() {
  const isAuthReady = useIsAuthReady();

  return useQuery({
    queryKey: queryKeys.overview.breakdown,
    queryFn: getSubscriptionBreakdown,
    enabled: isAuthReady,
  });
}

export function useRecentActivity() {
  const isAuthReady = useIsAuthReady();

  return useQuery({
    queryKey: queryKeys.overview.activity,
    queryFn: getRecentActivity,
    enabled: isAuthReady,
  });
}
