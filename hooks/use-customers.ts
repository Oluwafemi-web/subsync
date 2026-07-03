import { useQuery } from "@tanstack/react-query";
import {
  getCustomer,
  getCustomerPaymentMethods,
  getCustomers,
  getCustomerStats,
} from "@/lib/mock-api";
import { queryKeys } from "@/lib/query-keys";

export function useCustomers(search?: string) {
  return useQuery({
    queryKey: queryKeys.customers.list(search),
    queryFn: () => getCustomers(search),
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
