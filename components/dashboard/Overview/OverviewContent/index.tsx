"use client";

import { ActivityFeed } from "@/components/dashboard/Overview/ActivityFeed";
import { MetricCard } from "@/components/dashboard/Overview/MetricCard";
import { RevenueChart } from "@/components/dashboard/Overview/RevenueChart";
import { SubscriptionBreakdownChart } from "@/components/dashboard/Overview/SubscriptionBreakdownChart";
import {
  useOverviewMetrics,
  useRecentActivity,
  useRevenueChart,
  useSubscriptionBreakdown,
} from "@/hooks/use-overview";
import { formatCurrency, formatPercent } from "@/lib/format";

export function OverviewContent() {
  const { data: metrics, isLoading: metricsLoading } = useOverviewMetrics();
  const { data: revenue, isLoading: revenueLoading } = useRevenueChart();
  const { data: breakdown, isLoading: breakdownLoading } =
    useSubscriptionBreakdown();
  const { data: activity, isLoading: activityLoading } = useRecentActivity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Your subscription business at a glance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="MRR"
          value={
            metrics ? formatCurrency(metrics.mrr, { abbreviated: true }) : "—"
          }
          tooltip={metrics ? formatCurrency(metrics.mrr) : undefined}
          change={
            metrics ? formatPercent(metrics.mrrChangePercent) + " vs last month" : undefined
          }
          changePositive={metrics ? metrics.mrrChangePercent >= 0 : undefined}
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Active subscribers"
          value={metrics ? metrics.activeSubscribers.toLocaleString() : "—"}
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Churn rate"
          value={metrics ? `${metrics.churnRate}%` : "—"}
          change="Last 30 days"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Dunning recovery"
          value={metrics ? `${metrics.dunningRecoveryRate}%` : "—"}
          change="Recovery rate"
          changePositive={metrics ? metrics.dunningRecoveryRate >= 50 : undefined}
          isLoading={metricsLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart data={revenue ?? []} isLoading={revenueLoading} />
        <SubscriptionBreakdownChart
          data={breakdown ?? []}
          isLoading={breakdownLoading}
        />
      </div>

      <ActivityFeed events={activity ?? []} isLoading={activityLoading} />
    </div>
  );
}
