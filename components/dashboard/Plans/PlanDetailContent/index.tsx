"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MetricCard } from "@/components/dashboard/Overview/MetricCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlan, usePlanStats } from "@/hooks/use-plans";
import {
  formatBillingDate,
  formatCurrency,
  formatPlanInterval,
} from "@/lib/format";
import { getPlanStatusLabel, getPlanStatusStyle } from "@/lib/status";
import type { IPlanDetailContentProps } from "./@types";

export function PlanDetailContent({ planId }: IPlanDetailContentProps) {
  const { data: plan, isLoading: planLoading } = usePlan(planId);
  const { data: stats, isLoading: statsLoading } = usePlanStats(planId);

  if (planLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" render={<Link href="/dashboard/plans" />}>
          <ArrowLeft className="h-4 w-4" />
          Back to plans
        </Button>
        <p className="text-sm text-muted-foreground">Plan not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/plans" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{plan.name}</h1>
            <StatusBadge
              label={getPlanStatusLabel(plan.status)}
              className={getPlanStatusStyle(plan.status)}
            />
          </div>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Active subscriptions"
          value={stats?.activeSubscriptions.toLocaleString() ?? "—"}
          isLoading={statsLoading}
        />
        <MetricCard
          title="MRR from plan"
          value={stats ? formatCurrency(stats.mrr, { abbreviated: true }) : "—"}
          tooltip={stats ? formatCurrency(stats.mrr) : undefined}
          isLoading={statsLoading}
        />
        <MetricCard
          title="Avg. subscription age"
          value={stats ? `${stats.averageAgeDays} days` : "—"}
          isLoading={statsLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-medium">
                {formatCurrency(plan.price)}
                {formatPlanInterval(plan.interval, plan.customIntervalDays)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trial period</span>
              <span className="font-medium">
                {plan.trialDays > 0 ? `${plan.trialDays} days` : "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {formatBillingDate(plan.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
