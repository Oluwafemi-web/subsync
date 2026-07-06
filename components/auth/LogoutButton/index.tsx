"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { clearAuthSessionAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { ILogoutButtonProps } from "./@types";

export function LogoutButton({
  variant = "menu-item",
  className,
}: ILogoutButtonProps) {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
      clearSession();
      await clearAuthSessionAction();
      router.push("/login");
      router.refresh();
    });
  }

  const label = isPending ? "Signing out..." : "Sign out";

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="ghost"
        className={cn("w-full justify-start gap-3 px-3", className)}
        onClick={handleLogout}
        disabled={isPending}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {label}
      </Button>
    );
  }

  return (
    <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
      {label}
    </DropdownMenuItem>
  );
}
