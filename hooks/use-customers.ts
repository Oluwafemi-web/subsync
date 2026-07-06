import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCustomer,
  getCustomer,
  getCustomerPaymentMethods,
  getCustomersPaginated,
  getCustomerStats,
  updateCustomer,
} from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import type {
  ICreateCustomerInput,
  ICustomerFilters,
  IUpdateCustomerInput,
} from "@/types";

export function useCustomers(filters: ICustomerFilters = {}) {
  return useQuery({
    queryKey: queryKeys.customers.list(filters as Record<string, unknown>),
    queryFn: () => getCustomersPaginated(filters),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => getCustomer(id),
    enabled: Boolean(id),
  });
}

export function useCustomerStats(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.stats(id),
    queryFn: () => getCustomerStats(id),
    enabled: Boolean(id),
  });
}

export function useCustomerPaymentMethods(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.paymentMethods(id),
    queryFn: () => getCustomerPaymentMethods(id),
    enabled: Boolean(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateCustomerInput) => createCustomer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IUpdateCustomerInput) => updateCustomer(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(id),
      });
    },
  });
}
