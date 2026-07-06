"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { IForgotPasswordProgressProps } from "./@types";

const STEP_LABELS = ["Email", "Verify code", "New password"];

export function ForgotPasswordProgress({
  step,
  totalSteps = 3,
}: IForgotPasswordProgressProps) {
  const progressValue = (step / totalSteps) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Step {step} of {totalSteps}
        </span>
        <span className="text-muted-foreground">{STEP_LABELS[step - 1]}</span>
      </div>
      <Progress value={progressValue} />
      <div className="flex justify-between">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === step;
          const isComplete = stepNumber < step;

          return (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                  isActive &&
                    "border-primary bg-primary text-primary-foreground",
                  isComplete && "border-primary bg-primary/10 text-primary",
                  !isActive &&
                    !isComplete &&
                    "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {stepNumber}
              </div>
              <span
                className={cn(
                  "hidden text-[10px] sm:block",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
