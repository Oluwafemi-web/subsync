import { format, subDays } from "date-fns";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/config";
import { apiListRequest, apiRequest } from "@/lib/api/client";
import { buildQuery } from "@/lib/api/query";
import { fromMinorUnits, mapSubscription } from "@/lib/api/resource-mappers";
import type {
  IApiChurnAnalytics,
  IApiDunningAnalytics,
  IApiInvoice,
  IApiMrrAnalytics,
  IApiRevenueAnalytics,
  IApiSubscription,
} from "@/lib/api/@types";
import type {
  IActivityEvent,
  IAnalyticsDateRange,
  IOverviewMetrics,
  IRevenueDataPoint,
  ISubscriptionBreakdown,
  TSubscriptionState,
} from "@/types";

function defaultDateRange(): IAnalyticsDateRange {
  const to = format(new Date(), "yyyy-MM-dd");
  const from = format(subDays(new Date(), 30), "yyyy-MM-dd");
  return { from, to };
}

function resolveDateRange(range?: IAnalyticsDateRange): IAnalyticsDateRange {
  return range ?? defaultDateRange();
}

export async function fetchOverviewMetrics(
  range?: IAnalyticsDateRange
): Promise<IOverviewMetrics> {
  const { from, to } = resolveDateRange(range);

  const [mrr, churn, dunning] = await Promise.all([
    apiRequest<IApiMrrAnalytics>("/analytics/mrr"),
    apiRequest<IApiChurnAnalytics>(
      `/analytics/churn${buildQuery({ from, to })}`
    ),
    apiRequest<IApiDunningAnalytics>(
      `/analytics/dunning${buildQuery({ from, to })}`
    ),
  ]);

  return {
    mrr: fromMinorUnits(mrr.mrr),
    mrrChangePercent: 0,
    activeSubscribers: mrr.active_subscriptions,
    churnRate: churn.churn_rate ?? 0,
    dunningRecoveryRate: dunning.recovery_rate ?? 0,
  };
}

export async function fetchRevenueChart(
  range?: IAnalyticsDateRange
): Promise<IRevenueDataPoint[]> {
  const { from, to } = resolveDateRange(range);

  const data = await apiRequest<IApiRevenueAnalytics>(
    `/analytics/revenue${buildQuery({ from, to })}`
  );

  return (data.daily ?? []).map((point) => ({
    date: point.date,
    revenue: fromMinorUnits(point.amount),
  }));
}

export async function fetchSubscriptionBreakdown(): Promise<
  ISubscriptionBreakdown[]
> {
  const { data } = await apiListRequest<IApiSubscription[]>(
    `/subscriptions${buildQuery({ per_page: 100 })}`
  );

  const counts = new Map<TSubscriptionState, number>();

  for (const sub of data ?? []) {
    const mapped = mapSubscription(sub);
    counts.set(mapped.state, (counts.get(mapped.state) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([state, count]) => ({
    state,
    count,
  }));
}

export async function fetchRecentActivity(): Promise<IActivityEvent[]> {
  const [subscriptions, invoices] = await Promise.all([
    apiListRequest<IApiSubscription[]>(
      `/subscriptions${buildQuery({ per_page: 5 })}`
    ),
    apiListRequest<IApiInvoice[]>(
      `/invoices${buildQuery({ per_page: 5 })}`
    ),
  ]);

  const events: IActivityEvent[] = [];

  for (const sub of subscriptions.data ?? []) {
    const mapped = mapSubscription(sub);
    events.push({
      id: `act_sub_${mapped.id}`,
      type: "subscription_created",
      title: "Subscription updated",
      description: `${mapped.customerName} — ${mapped.planName}`,
      entityId: mapped.id,
      entityType: "subscription",
      createdAt: mapped.createdAt,
    });
  }

  for (const invoice of invoices.data ?? []) {
    const type =
      invoice.status === "paid" ? "invoice_paid" : "payment_failed";
    events.push({
      id: `act_inv_${invoice.id}`,
      type,
      title: invoice.status === "paid" ? "Invoice paid" : "Invoice updated",
      description: `${invoice.customer_name ?? "Customer"} — ${fromMinorUnits(invoice.amount)}`,
      entityId: invoice.id,
      entityType: "invoice",
      createdAt: invoice.created_at,
    });
  }

  return events
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);
}
