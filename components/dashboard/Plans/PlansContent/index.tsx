"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { PlanFormDialog } from "@/components/dashboard/Plans/PlanFormDialog";
import { Pagination } from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlans } from "@/hooks/use-plans";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/config";
import { formatCurrency, formatPlanInterval } from "@/lib/format";
import { getPlanStatusLabel, getPlanStatusStyle } from "@/lib/status";

export function PlansContent() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading } = usePlans({ page, pageSize: DEFAULT_PAGE_SIZE });
  const plans = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Plans</h1>
          <p className="text-sm text-muted-foreground">
            Manage pricing plans and subscription tiers
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New plan
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/dashboard/plans/${plan.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-medium">
                      {plan.name}
                    </CardTitle>
                    <StatusBadge
                      label={getPlanStatusLabel(plan.status)}
                      className={getPlanStatusStyle(plan.status)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-2xl font-bold tracking-tight">
                    {formatCurrency(plan.price)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {formatPlanInterval(plan.interval, plan.customIntervalDays)}
                    </span>
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {plan.activeSubscribers.toLocaleString()} subscribers
                    </span>
                    {plan.trialDays > 0 && (
                      <span>{plan.trialDays}-day trial</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary">
                    View details
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          pageSize={data.pageSize}
          onPageChange={setPage}
        />
      )}

      <PlanFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
      />
    </div>
  );
}
