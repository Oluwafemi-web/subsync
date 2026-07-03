import { ReactNode } from "react";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";

export interface IDashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: IDashboardShellProps) {
  return (
    <div className="flex min-h-screen md:h-screen md:overflow-hidden">
      <Sidebar />
      <div className="flex min-h-0 flex-1 flex-col pb-16 md:pb-0">
        <TopNav />
        <main className="min-h-0 flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
