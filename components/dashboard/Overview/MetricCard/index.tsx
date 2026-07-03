"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { IMetricCardProps } from "./@types";

export function MetricCard({
  title,
  value,
  change,
  changePositive,
  tooltip,
  isLoading,
}: IMetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-3 w-16" />
        </CardContent>
      </Card>
    );
  }

  const content = (
    <Card className={tooltip ? "cursor-default" : undefined}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {change && (
          <p
            className={cn(
              "mt-1 text-xs font-medium",
              changePositive === true && "text-emerald-600 dark:text-emerald-400",
              changePositive === false && "text-red-600 dark:text-red-400",
              changePositive === undefined && "text-muted-foreground"
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (!tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger render={<div className="h-full" />}>{content}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
