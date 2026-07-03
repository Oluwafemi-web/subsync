"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { MetricCard } from "@/components/dashboard/Overview/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCustomer,
  useCustomerPaymentMethods,
  useCustomerStats,
} from "@/hooks/use-customers";
import { formatBillingDate, formatCurrency } from "@/lib/format";
import type { ICustomerDetailContentProps } from "./@types";

export function CustomerDetailContent({
  customerId,
}: ICustomerDetailContentProps) {
  const { data: customer, isLoading } = useCustomer(customerId);
  const { data: stats, isLoading: statsLoading } = useCustomerStats(customerId);
  const { data: paymentMethods, isLoading: pmLoading } =
    useCustomerPaymentMethods(customerId);

  if (isLoading) {
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

  if (!customer) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard/customers" />}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to customers
        </Button>
        <p className="text-sm text-muted-foreground">Customer not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/dashboard/customers" />}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {customer.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {customer.email}
            {customer.phone ? ` · ${customer.phone}` : ""}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Active subscriptions"
          value={stats?.activeSubscriptions.toLocaleString() ?? "—"}
          isLoading={statsLoading}
        />
        <MetricCard
          title="Total paid"
          value={
            stats ? formatCurrency(stats.totalPaid, { abbreviated: true }) : "—"
          }
          tooltip={stats ? formatCurrency(stats.totalPaid) : undefined}
          isLoading={statsLoading}
        />
        <MetricCard
          title="Lifetime value"
          value={
            stats
              ? formatCurrency(stats.lifetimeValue, { abbreviated: true })
              : "—"
          }
          tooltip={stats ? formatCurrency(stats.lifetimeValue) : undefined}
          isLoading={statsLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer ID</span>
              <span className="font-mono text-xs">{customer.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined</span>
              <span className="font-medium">
                {formatBillingDate(customer.joinedAt)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Payment methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pmLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : paymentMethods && paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {pm.type === "card"
                            ? `${pm.brand ?? "Card"} ···· ${pm.last4}`
                            : `Bank ···· ${pm.last4}`}
                        </p>
                        {pm.expiryMonth && pm.expiryYear && (
                          <p className="text-xs text-muted-foreground">
                            Expires {pm.expiryMonth}/{pm.expiryYear}
                          </p>
                        )}
                      </div>
                    </div>
                    {pm.isDefault && (
                      <span className="text-xs text-muted-foreground">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payment methods on file
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
