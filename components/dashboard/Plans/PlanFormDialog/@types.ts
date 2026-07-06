import type { IPlan } from "@/types";

export interface IPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  plan?: IPlan;
  onSuccess?: () => void;
}
