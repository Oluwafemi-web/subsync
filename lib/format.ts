import { format, formatDistanceToNow, isAfter, subDays } from "date-fns";

export function formatCurrency(
  amount: number,
  options?: { abbreviated?: boolean; currency?: string }
): string {
  const { abbreviated = false, currency = "NGN" } = options ?? {};

  if (abbreviated && Math.abs(amount) >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (abbreviated && Math.abs(amount) >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Prefer API-provided display string, fall back to formatting the amount. */
export function formatInvoiceAmount(
  amount: number,
  display?: string
): string {
  return display ?? formatCurrency(amount);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/** Parse a date string, returning null when the value is missing or invalid. */
function parseValidDate(dateString?: string | null): Date | null {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatRelativeOrAbsolute(
  dateString?: string | null,
  fallback = "—"
): string {
  const date = parseValidDate(dateString);
  if (!date) {
    return fallback;
  }

  const sevenDaysAgo = subDays(new Date(), 7);

  if (isAfter(date, sevenDaysAgo)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, "EEE d MMM yyyy");
}

export function formatBillingDate(
  dateString?: string | null,
  fallback = "—"
): string {
  const date = parseValidDate(dateString);
  return date ? format(date, "EEE d MMM yyyy") : fallback;
}

export function formatDateTime(
  dateString?: string | null,
  fallback = "—"
): string {
  const date = parseValidDate(dateString);
  return date ? format(date, "MMM d, yyyy h:mm a") : fallback;
}

export function formatPlanInterval(
  interval: "day" | "week" | "month" | "year" | "custom",
  customIntervalDays?: number
): string {
  if (interval === "custom" && customIntervalDays) {
    return ` / ${customIntervalDays} days`;
  }

  const units: Record<typeof interval, string> = {
    day: "day",
    week: "week",
    month: "month",
    year: "year",
    custom: "period",
  };

  return ` / ${units[interval]}`;
}
