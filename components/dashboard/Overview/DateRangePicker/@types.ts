import type { IAnalyticsDateRange } from "@/types";

export interface IDateRangePickerProps {
  value: IAnalyticsDateRange;
  onChange: (range: IAnalyticsDateRange) => void;
}
