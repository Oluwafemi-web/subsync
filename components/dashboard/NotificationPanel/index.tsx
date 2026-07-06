"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatRelativeOrAbsolute } from "@/lib/format";
import { markNotificationRead } from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import type { INotificationPanelProps } from "./@types";

export function NotificationPanel({
  open,
  onOpenChange,
  notifications,
}: INotificationPanelProps) {
  const queryClient = useQueryClient();

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Recent activity and alerts for your account
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(100vh-8rem)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1 pr-4">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={cn(
                    "w-full rounded-lg p-3 text-left transition-colors hover:bg-muted/50",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => {
                    if (!notification.read) {
                      markRead.mutate(notification.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {formatRelativeOrAbsolute(notification.createdAt)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
