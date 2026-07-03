import { useQuery } from "@tanstack/react-query";
import {
  getOverviewMetrics,
  getRecentActivity,
  getRevenueChart,
  getSubscriptionBreakdown,
} from "@/lib/mock-api";
import { queryKeys } from "@/lib/query-keys";

export function useOverviewMetrics() {
  return useQuery({
    queryKey: queryKeys.overview.metrics,
    queryFn: getOverviewMetrics,
  });
}

export function useRevenueChart() {
  return useQuery({
    queryKey: queryKeys.overview.revenue,
    queryFn: getRevenueChart,
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
