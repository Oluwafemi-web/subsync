import { format, subDays } from "date-fns";
import type { IAnalyticsDateRange } from "@/types";

export function getDefaultAnalyticsDateRange(): IAnalyticsDateRange {
  return {
    from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  };
}

export function formatAnalyticsDateRangeLabel(range: IAnalyticsDateRange): string {
  return `${range.from} to ${range.to}`;
}
