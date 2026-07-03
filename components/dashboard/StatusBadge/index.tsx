import { cn } from "@/lib/utils";
import type { IStatusBadgeProps } from "./@types";

export function StatusBadge({ label, className }: IStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}
