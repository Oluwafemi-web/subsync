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

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function formatRelativeOrAbsolute(dateString: string): string {
  const date = new Date(dateString);
  const sevenDaysAgo = subDays(new Date(), 7);

  if (isAfter(date, sevenDaysAgo)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, "EEE d MMM yyyy");
}

export function formatBillingDate(dateString: string): string {
  return format(new Date(dateString), "EEE d MMM yyyy");
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy h:mm a");
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
