import type { TActivityType } from "@/types";

const ACTIVITY_BADGE_STYLES: Record<TActivityType, string> = {
  subscription_created: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  subscription_canceled: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  subscription_paused: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  payment_succeeded: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  payment_failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  invoice_paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  customer_created: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  plan_created: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
};

const ACTIVITY_LABELS: Record<TActivityType, string> = {
  subscription_created: "Subscription",
  subscription_canceled: "Canceled",
  subscription_paused: "Paused",
  payment_succeeded: "Payment",
  payment_failed: "Failed",
  invoice_paid: "Invoice",
  customer_created: "Customer",
  plan_created: "Plan",
};

export function getActivityBadgeStyle(type: TActivityType): string {
  return ACTIVITY_BADGE_STYLES[type];
}

export function getActivityLabel(type: TActivityType): string {
  return ACTIVITY_LABELS[type];
}

export function getActivityHref(
  entityType: "subscription" | "invoice" | "customer" | "plan",
  entityId: string
): string {
  const routes = {
    subscription: `/dashboard/subscriptions/${entityId}`,
    invoice: `/dashboard/invoices/${entityId}`,
    customer: `/dashboard/customers/${entityId}`,
    plan: `/dashboard/plans/${entityId}`,
  };
  return routes[entityType];
}
