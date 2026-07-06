"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" duration={5000} />
        </TooltipProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
