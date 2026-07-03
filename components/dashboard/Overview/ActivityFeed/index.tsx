"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getActivityBadgeStyle,
  getActivityHref,
  getActivityLabel,
} from "@/lib/activity";
import { formatRelativeOrAbsolute } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IActivityFeedProps } from "./@types";

export function ActivityFeed({ events, isLoading }: IActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Recent activity</CardTitle>
        <p className="text-xs text-muted-foreground">Last 10 events</p>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-0 divide-y px-6 pb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="h-5 w-16 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-muted-foreground">
            No recent activity
          </p>
        ) : (
          <div className="divide-y">
            {events.map((event) => (
              <Link
                key={event.id}
                href={getActivityHref(event.entityType, event.entityId)}
                className="flex items-start gap-3 px-6 py-3 transition-colors hover:bg-muted/50"
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    getActivityBadgeStyle(event.type)
                  )}
                >
                  {getActivityLabel(event.type)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {event.description}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeOrAbsolute(event.createdAt)}
                </time>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
