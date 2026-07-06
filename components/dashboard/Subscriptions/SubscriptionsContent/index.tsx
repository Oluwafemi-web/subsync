"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CheckoutDialog } from "@/components/dashboard/Subscriptions/CheckoutDialog";
import { DataTable } from "@/components/dashboard/DataTable";
import { Pagination } from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/config";
import { formatBillingDate, formatCurrency } from "@/lib/format";
import {
  getSubscriptionStateLabel,
  getSubscriptionStateStyle,
} from "@/lib/status";
import type { ISubscription, TSubscriptionState } from "@/types";

const STATE_FILTERS: Array<{ value: TSubscriptionState | ""; label: string }> =
  [
    { value: "", label: "All states" },
    { value: "incomplete", label: "Pending payment" },
    { value: "active", label: "Active" },
    { value: "trialing", label: "Trialing" },
    { value: "past_due", label: "Past due" },
    { value: "paused", label: "Paused" },
    { value: "canceled", label: "Canceled" },
    { value: "expired", label: "Expired" },
  ];

export function SubscriptionsContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [state, setState] = useState<TSubscriptionState | "">("");
  const [page, setPage] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { data, isLoading } = useSubscriptions({
    search: search || undefined,
    state: state || undefined,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const columns = [
    {
      key: "customer",
      header: "Customer",
      cell: (row: ISubscription) => (
        <div>
          <p className="font-medium">{row.customerName}</p>
          <p className="text-xs text-muted-foreground">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      cell: (row: ISubscription) => row.planName,
    },
    {
      key: "state",
      header: "State",
      cell: (row: ISubscription) => (
        <StatusBadge
          label={getSubscriptionStateLabel(row.state)}
          className={getSubscriptionStateStyle(row.state)}
        />
      ),
    },
    {
      key: "mrr",
      header: "MRR",
      cell: (row: ISubscription) => formatCurrency(row.mrr),
      className: "text-right",
    },
    {
      key: "period",
      header: "Current period",
      cell: (row: ISubscription) => (
        <span className="text-xs text-muted-foreground">
          {formatBillingDate(row.currentPeriodStart)} –{" "}
          {formatBillingDate(row.currentPeriodEnd)}
        </span>
      ),
    },
  ];

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStateChange(value: TSubscriptionState | "") {
    setState(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
          <p className="text-sm text-muted-foreground">
            View and manage active subscriptions
          </p>
        </div>
        <Button onClick={() => setCheckoutOpen(true)}>
          <Plus className="h-4 w-4" />
          New subscription
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by customer or ID..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="sm:max-w-xs"
        />
        <select
          value={state}
          onChange={(e) =>
            handleStateChange(e.target.value as TSubscriptionState | "")
          }
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {STATE_FILTERS.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyMessage="No subscriptions match your filters"
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/dashboard/subscriptions/${row.id}`)}
      />

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          pageSize={data.pageSize}
          onPageChange={setPage}
        />
      )}

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
}
