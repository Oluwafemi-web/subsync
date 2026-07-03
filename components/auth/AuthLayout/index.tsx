import Link from "next/link";
import { cn } from "@/lib/utils";
import type { IAuthLayoutProps } from "./@types";

export function AuthLayout({
  children,
  title,
  description,
  contentClassName,
}: IAuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(1_0_0/0.12),transparent_55%)]" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-foreground text-primary text-xs font-bold">
              SS
            </div>
            <span className="text-lg">SubSync</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed">
              &ldquo;SubSync made subscription billing effortless. We launched
              recurring payments in days, not months.&rdquo;
            </p>
            <footer className="text-sm text-primary-foreground/80">
              — Acme SaaS Ltd
            </footer>
          </blockquote>
        </div>
        <p className="relative z-10 text-sm text-primary-foreground/70">
          Subscription billing platform for Nigerian merchants
        </p>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-center p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              SS
            </div>
            <span className="text-lg">SubSync</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className={cn("w-full space-y-6", contentClassName ?? "max-w-sm")}>
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
