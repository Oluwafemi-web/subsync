import type { IActivityEvent } from "@/types";

export interface IActivityFeedProps {
  events: IActivityEvent[];
  isLoading?: boolean;
}
