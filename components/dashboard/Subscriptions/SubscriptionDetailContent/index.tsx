"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSubscription,
  useSubscriptionTransitions,
} from "@/hooks/use-subscriptions";
import { formatBillingDate, formatCurrency, formatDateTime } from "@/lib/format";
import {
  getSubscriptionStateLabel,
  getSubscriptionStateStyle,
} from "@/lib/status";
import type { ISubscriptionDetailContentProps } from "./@types";

export function SubscriptionDetailContent({
  subscriptionId,
}: ISubscriptionDetailContentProps) {
  const { data: subscription, isLoading } = useSubscription(subscriptionId);
  const { data: transitions, isLoading: transitionsLoading } =
    useSubscriptionTransitions(subscriptionId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard/subscriptions" />}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to subscriptions
        </Button>
        <p className="text-sm text-muted-foreground">Subscription not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/dashboard/subscriptions" />}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {subscription.customerName}
            </h1>
            <StatusBadge
              label={getSubscriptionStateLabel(subscription.state)}
              className={getSubscriptionStateStyle(subscription.state)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {subscription.id} · {subscription.planName}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <Link
                href={`/dashboard/customers/${subscription.customerId}`}
                className="font-medium text-primary hover:underline"
              >
                {subscription.customerEmail}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <Link
                href={`/dashboard/plans/${subscription.planId}`}
                className="font-medium text-primary hover:underline"
              >
                {subscription.planName}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MRR</span>
              <span className="font-medium">
                {formatCurrency(subscription.mrr)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current period</span>
              <span className="font-medium">
                {formatBillingDate(subscription.currentPeriodStart)} –{" "}
                {formatBillingDate(subscription.currentPeriodEnd)}
              </span>
            </div>
            {subscription.trialEnd && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trial ends</span>
                <span className="font-medium">
                  {formatBillingDate(subscription.trialEnd)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {formatBillingDate(subscription.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              State transitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transitionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {transitions?.map((transition) => (
                  <div
                    key={transition.id}
                    className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {transition.fromState
                          ? `${getSubscriptionStateLabel(transition.fromState)} → ${getSubscriptionStateLabel(transition.toState)}`
                          : `Created as ${getSubscriptionStateLabel(transition.toState)}`}
                      </p>
                      {transition.reason && (
                        <p className="text-xs text-muted-foreground">
                          {transition.reason}
                        </p>
                      )}
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground">
                      {formatDateTime(transition.createdAt)}
                    </time>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
