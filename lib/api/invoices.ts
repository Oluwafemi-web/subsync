import { DEFAULT_PAGE_SIZE, getNgrokSkipHeaders } from "@/lib/api/config";
import { apiListRequest, apiRequest, apiRequestVoid } from "@/lib/api/client";
import { mapPaginatedResponse } from "@/lib/api/pagination";
import { buildQuery } from "@/lib/api/query";
import { mapInvoice } from "@/lib/api/resource-mappers";
import { fetchCustomer } from "@/lib/api/customers";
import type { IApiInvoice, IApiInvoiceDetail } from "@/lib/api/@types";
import type { IInvoice, IInvoiceFilters, IPaginatedResponse } from "@/types";

/**
 * The detail endpoint returns the invoice nested under `invoice` with its
 * line items alongside (using Go-style PascalCase keys), while the list
 * endpoint returns a flat invoice. Normalize both into a single IApiInvoice.
 */
function normalizeInvoiceDetail(
  data: IApiInvoice | IApiInvoiceDetail
): IApiInvoice {
  if (!("invoice" in data)) {
    return data;
  }

  return {
    ...data.invoice,
    line_items: (data.line_items ?? []).map((item) => ({
      description: item.Description,
      quantity: 1,
      unit_price: item.Amount,
      amount: item.Amount,
    })),
  };
}

export async function fetchInvoices(
  filters: IInvoiceFilters = {}
): Promise<IPaginatedResponse<IInvoice>> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  const { data, meta } = await apiListRequest<IApiInvoice[]>(
    `/invoices${buildQuery({
      page,
      per_page: pageSize,
      status: filters.status,
      subscription_id: filters.subscriptionId,
    })}`
  );

  let mapped = (data ?? []).map(mapInvoice);

  if (filters.dateFrom) {
    mapped = mapped.filter((inv) => inv.createdAt >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    mapped = mapped.filter((inv) => inv.createdAt <= filters.dateTo!);
  }

  if (filters.amountMin !== undefined) {
    mapped = mapped.filter((inv) => inv.amountDue >= filters.amountMin!);
  }

  if (filters.amountMax !== undefined) {
    mapped = mapped.filter((inv) => inv.amountDue <= filters.amountMax!);
  }

  return mapPaginatedResponse(mapped, meta, pageSize);
}

export async function fetchInvoice(id: string): Promise<IInvoice | null> {
  try {
    const data = await apiRequest<IApiInvoice | IApiInvoiceDetail>(
      `/invoices/${id}`
    );
    const invoice = mapInvoice(normalizeInvoiceDetail(data));

    if (!invoice.customer && invoice.customerId) {
      const customer = await fetchCustomer(invoice.customerId);
      if (customer) {
        return {
          ...invoice,
          customer,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
        };
      }
    }

    return invoice;
  } catch {
    return null;
  }
}

export async function voidInvoice(id: string): Promise<void> {
  await apiRequestVoid(`/invoices/${id}/void`, { method: "POST" });
}

export async function retryInvoice(id: string): Promise<void> {
  await apiRequestVoid(`/invoices/${id}/retry`, { method: "POST" });
}

export async function downloadInvoicePdf(id: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const { getAccessToken } = await import("@/store/auth-store");
  const token = getAccessToken();

  const response = await fetch(`${baseUrl}/invoices/${id}/pdf`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...getNgrokSkipHeaders(),
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to download invoice PDF");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${id}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
