"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Webhook,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { cn } from "@/lib/utils";
import type { INavItem } from "./@types";

const navItems: INavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Plans", href: "/dashboard/plans", icon: Package },
  { label: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { label: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:overflow-hidden md:border-r md:bg-sidebar">
      <div className="flex h-14 items-center border-b px-5">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Image
            src="/subsync.png"
            alt="SubSync"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-contain"
            priority
          />
          <span>SubSync</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <LogoutButton variant="button" />
      </div>
    </aside>
  );
}
