import { useQuery } from "@tanstack/react-query";
import { getInvoice, getInvoices } from "@/lib/mock-api";
import { queryKeys } from "@/lib/query-keys";
import type { IInvoiceFilters } from "@/types";

export function useInvoices(filters: IInvoiceFilters = {}) {
  return useQuery({
    queryKey: queryKeys.invoices.list(
      filters as Record<string, unknown>
    ),
    queryFn: () => getInvoices(filters),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: () => getInvoice(id),
    enabled: Boolean(id),
  });
}
