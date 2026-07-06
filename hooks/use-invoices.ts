import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  downloadInvoicePdf,
  getInvoice,
  getInvoices,
  retryInvoiceCharge,
  voidInvoice,
} from "@/lib/data";
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

export function useVoidInvoice(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => voidInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(id),
      });
    },
  });
}

export function useRetryInvoice(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => retryInvoiceCharge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(id),
      });
    },
  });
}

export function useDownloadInvoicePdf(id: string) {
  return useMutation({
    mutationFn: () => downloadInvoicePdf(id),
  });
}
