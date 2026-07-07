import { DEFAULT_PAGE_SIZE, getNgrokSkipHeaders } from "@/lib/api/config";
import { apiListRequest, apiRequest, apiRequestVoid } from "@/lib/api/client";
import { mapPaginatedResponse } from "@/lib/api/pagination";
import { buildQuery } from "@/lib/api/query";
import { mapInvoice } from "@/lib/api/resource-mappers";
import type { IApiInvoice } from "@/lib/api/@types";
import type { IInvoice, IInvoiceFilters, IPaginatedResponse } from "@/types";

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
    mapped = mapped.filter((inv) => inv.amount >= filters.amountMin!);
  }

  if (filters.amountMax !== undefined) {
    mapped = mapped.filter((inv) => inv.amount <= filters.amountMax!);
  }

  return mapPaginatedResponse(mapped, meta, pageSize);
}

export async function fetchInvoice(id: string): Promise<IInvoice | null> {
  try {
    const data = await apiRequest<IApiInvoice>(`/invoices/${id}`);
    return mapInvoice(data);
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
