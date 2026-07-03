import type { IRevenueDataPoint } from "@/types";

export interface IRevenueChartProps {
  data: IRevenueDataPoint[];
  isLoading?: boolean;
}
