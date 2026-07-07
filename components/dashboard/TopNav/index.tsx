"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton/index";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications, getSettings } from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import { useIsAuthReady } from "@/hooks/use-auth-ready";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import type { ITopNavProps } from "./@types";
import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
  dashboard: "Overview",
  plans: "Plans",
  subscriptions: "Subscriptions",
  customers: "Customers",
  invoices: "Invoices",
  webhooks: "Webhooks",
  settings: "Settings",
  new: "New",
  deliveries: "Deliveries",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      breadcrumbLabels[segment] ??
      (segment.startsWith("sub_") ||
      segment.startsWith("cus_") ||
      segment.startsWith("inv_") ||
      segment.startsWith("plan_") ||
      segment.startsWith("wh_")
        ? segment
        : segment.charAt(0).toUpperCase() + segment.slice(1));
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });
}

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return initials || "M";
}

export function TopNav({ merchantName, merchantEmail }: ITopNavProps) {
  const breadcrumbs = useBreadcrumbs();
  const { notificationsOpen, setNotificationsOpen } = useAppStore();
  const authUser = useAuthStore((state) => state.user);
  const isAuthReady = useIsAuthReady();

  const { data: settings } = useQuery({
    queryKey: queryKeys.settings,
    queryFn: getSettings,
    enabled: isAuthReady,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: getNotifications,
  });

  const name =
    merchantName ?? authUser?.name ?? settings?.merchant.name ?? "Merchant";
  const email =
    merchantEmail ?? authUser?.email ?? settings?.merchant.email ?? "";
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={crumb.href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={crumb.href} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setNotificationsOpen(true)}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
                {unreadCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "rounded-full"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/dashboard/settings">Settings</Link>}
              />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <NotificationPanel
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        notifications={notifications}
      />
    </>
  );
}
