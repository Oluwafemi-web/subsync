"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Pagination } from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useInvoices } from "@/hooks/use-invoices";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/config";
import { formatBillingDate, formatInvoiceAmount } from "@/lib/format";
import {
  getInvoiceStatusLabel,
  getInvoiceStatusStyle,
} from "@/lib/status";
import type { IInvoice, TInvoiceStatus } from "@/types";

const STATUS_FILTERS: Array<{ value: TInvoiceStatus | ""; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
  { value: "void", label: "Void" },
  { value: "uncollectible", label: "Uncollectible" },
];

export function InvoicesContent() {
  const router = useRouter();
  const [status, setStatus] = useState<TInvoiceStatus | "">("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useInvoices({
    status: status || undefined,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const columns = [
    {
      key: "number",
      header: "Invoice",
      cell: (row: IInvoice) => (
        <div>
          <p className="font-medium">{row.number}</p>
          <p className="text-xs text-muted-foreground">{row.id}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (row: IInvoice) => (
        <div>
          <p className="font-medium">{row.customerName}</p>
          {row.customerEmail && (
            <p className="text-xs text-muted-foreground">{row.customerEmail}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: IInvoice) => (
        <StatusBadge
          label={getInvoiceStatusLabel(row.status)}
          className={getInvoiceStatusStyle(row.status)}
        />
      ),
    },
    {
      key: "amount",
      header: "Amount due",
      cell: (row: IInvoice) =>
        formatInvoiceAmount(row.amountDue, row.amountDueDisplay),
      className: "text-right",
    },
    {
      key: "created",
      header: "Created",
      cell: (row: IInvoice) => (
        <span className="text-xs text-muted-foreground">
          {formatBillingDate(row.createdAt)}
        </span>
      ),
    },
  ];

  function handleStatusChange(value: TInvoiceStatus | "") {
    setStatus(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Track billing invoices and payment status
        </p>
      </div>

      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value as TInvoiceStatus | "")}
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {STATUS_FILTERS.map((filter) => (
          <option key={filter.value} value={filter.value}>
            {filter.label}
          </option>
        ))}
      </select>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyMessage="No invoices match your filters"
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/dashboard/invoices/${row.id}`)}
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
    </div>
  );
}
