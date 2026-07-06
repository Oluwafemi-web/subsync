"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CustomerFormDialog } from "@/components/dashboard/Customers/CustomerFormDialog";
import { DataTable } from "@/components/dashboard/DataTable";
import { Pagination } from "@/components/dashboard/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomers } from "@/hooks/use-customers";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/config";
import { formatBillingDate, formatCurrency } from "@/lib/format";
import type { ICustomer } from "@/types";

export function CustomersContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useCustomers({
    search: search || undefined,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });

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

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            View customer profiles and payment history
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add customer
        </Button>
      </div>

      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="sm:max-w-xs"
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyMessage="No customers found"
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/dashboard/customers/${row.id}`)}
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

      <CustomerFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
      />
    </div>
  );
}
