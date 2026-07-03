import type {
  TInvoiceStatus,
  TPlanStatus,
  TSubscriptionState,
  TWebhookDeliveryStatus,
} from "@/types";

const SUBSCRIPTION_STATE_STYLES: Record<TSubscriptionState, string> = {
  active:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  trialing:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  past_due:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  paused:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  canceled:
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const SUBSCRIPTION_STATE_LABELS: Record<TSubscriptionState, string> = {
  active: "Active",
  trialing: "Trialing",
  past_due: "Past due",
  paused: "Paused",
  canceled: "Canceled",
};

const INVOICE_STATUS_STYLES: Record<TInvoiceStatus, string> = {
  draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  open: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  void: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  uncollectible:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const INVOICE_STATUS_LABELS: Record<TInvoiceStatus, string> = {
  draft: "Draft",
  open: "Open",
  paid: "Paid",
  void: "Void",
  uncollectible: "Uncollectible",
};

const PLAN_STATUS_STYLES: Record<TPlanStatus, string> = {
  active:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  archived:
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const PLAN_STATUS_LABELS: Record<TPlanStatus, string> = {
  active: "Active",
  archived: "Archived",
};

const WEBHOOK_DELIVERY_STYLES: Record<TWebhookDeliveryStatus, string> = {
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

const WEBHOOK_DELIVERY_LABELS: Record<TWebhookDeliveryStatus, string> = {
  success: "Success",
  failed: "Failed",
  pending: "Pending",
};

export function getSubscriptionStateStyle(state: TSubscriptionState): string {
  return SUBSCRIPTION_STATE_STYLES[state];
}

export function getSubscriptionStateLabel(state: TSubscriptionState): string {
  return SUBSCRIPTION_STATE_LABELS[state];
}

export function getInvoiceStatusStyle(status: TInvoiceStatus): string {
  return INVOICE_STATUS_STYLES[status];
}

export function getInvoiceStatusLabel(status: TInvoiceStatus): string {
  return INVOICE_STATUS_LABELS[status];
}

export function getPlanStatusStyle(status: TPlanStatus): string {
  return PLAN_STATUS_STYLES[status];
}

export function getPlanStatusLabel(status: TPlanStatus): string {
  return PLAN_STATUS_LABELS[status];
}

export function getWebhookDeliveryStyle(
  status: TWebhookDeliveryStatus
): string {
  return WEBHOOK_DELIVERY_STYLES[status];
}

export function getWebhookDeliveryLabel(
  status: TWebhookDeliveryStatus
): string {
  return WEBHOOK_DELIVERY_LABELS[status];
}
