"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Input } from "@/components/ui/input";
import { useCustomers } from "@/hooks/use-customers";
import { formatBillingDate, formatCurrency } from "@/lib/format";
import type { ICustomer } from "@/types";

export function CustomersContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: customers, isLoading } = useCustomers(search || undefined);

  const columns = [
    {
      key: "name",
      header: "Customer",
      cell: (row: ICustomer) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (row: ICustomer) => row.phone ?? "—",
    },
    {
      key: "subscriptions",
      header: "Active subs",
      cell: (row: ICustomer) => row.activeSubscriptions,
      className: "text-right",
    },
    {
      key: "totalPaid",
      header: "Total paid",
      cell: (row: ICustomer) => formatCurrency(row.totalPaid),
      className: "text-right",
    },
    {
      key: "joined",
      header: "Joined",
      cell: (row: ICustomer) => (
        <span className="text-xs text-muted-foreground">
          {formatBillingDate(row.joinedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">
          View customer profiles and payment history
        </p>
      </div>

      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs"
      />

      <DataTable
        columns={columns}
        data={customers ?? []}
        isLoading={isLoading}
        emptyMessage="No customers found"
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/dashboard/customers/${row.id}`)}
      />
    </div>
  );
}
