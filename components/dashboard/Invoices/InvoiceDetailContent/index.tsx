"use client";

import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDownloadInvoicePdf,
  useInvoice,
  useRetryInvoice,
  useVoidInvoice,
} from "@/hooks/use-invoices";
import { getErrorMessage } from "@/lib/api/auth";
import { formatBillingDate, formatCurrency, formatDateTime } from "@/lib/format";
import {
  getInvoiceStatusLabel,
  getInvoiceStatusStyle,
} from "@/lib/status";
import type { IInvoiceDetailContentProps } from "./@types";

export function InvoiceDetailContent({ invoiceId }: IInvoiceDetailContentProps) {
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const voidInvoice = useVoidInvoice(invoiceId);
  const retryInvoice = useRetryInvoice(invoiceId);
  const downloadPdf = useDownloadInvoicePdf(invoiceId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard/invoices" />}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to invoices
        </Button>
        <p className="text-sm text-muted-foreground">Invoice not found</p>
      </div>
    );
  }

  const canRetry = ["open", "processing"].includes(invoice.status);
  const canVoid = ["open", "processing"].includes(invoice.status);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/dashboard/invoices" />}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {invoice.number}
            </h1>
            <StatusBadge
              label={getInvoiceStatusLabel(invoice.status)}
              className={getInvoiceStatusStyle(invoice.status)}
            />
          </div>
          <p className="text-sm text-muted-foreground">{invoice.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={downloadPdf.isPending}
            onClick={() =>
              downloadPdf.mutate(undefined, {
                onError: (e) => toast.error(getErrorMessage(e)),
              })
            }
          >
            {downloadPdf.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            PDF
          </Button>
          {canRetry && (
            <Button
              variant="outline"
              size="sm"
              disabled={retryInvoice.isPending}
              onClick={() =>
                retryInvoice.mutate(undefined, {
                  onSuccess: () => toast.success("Retry initiated"),
                  onError: (e) => toast.error(getErrorMessage(e)),
                })
              }
            >
              Retry charge
            </Button>
          )}
          {canVoid && (
            <Button
              variant="outline"
              size="sm"
              disabled={voidInvoice.isPending}
              onClick={() =>
                voidInvoice.mutate(undefined, {
                  onSuccess: () => toast.success("Invoice voided"),
                  onError: (e) => toast.error(getErrorMessage(e)),
                })
              }
            >
              Void
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <Link
                href={`/dashboard/customers/${invoice.customerId}`}
                className="font-medium text-primary hover:underline"
              >
                {invoice.customerName}
              </Link>
            </div>
            {invoice.subscriptionId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subscription</span>
                <Link
                  href={`/dashboard/subscriptions/${invoice.subscriptionId}`}
                  className="font-medium text-primary hover:underline"
                >
                  {invoice.subscriptionId}
                </Link>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-lg font-bold">
                {formatCurrency(invoice.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due date</span>
              <span className="font-medium">
                {formatBillingDate(invoice.dueDate)}
              </span>
            </div>
            {invoice.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid at</span>
                <span className="font-medium">
                  {formatDateTime(invoice.paidAt)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Line items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium text-right">Qty</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.lineItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
