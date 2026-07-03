import type { INotification } from "@/types";

export interface INotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: INotification[];
}
