import { DEFAULT_PAGE_SIZE } from "@/lib/api/config";
import { apiListRequest, apiRequest } from "@/lib/api/client";
import { mapPaginatedResponse } from "@/lib/api/pagination";
import { buildQuery } from "@/lib/api/query";
import {
  filterBySearch,
  fromMinorUnits,
  mapCustomer,
  mapInvoice,
  mapPaymentMethod,
  mapSubscription,
} from "@/lib/api/resource-mappers";
import type {
  IApiCustomer,
  IApiInvoice,
  IApiPaymentMethod,
  IApiSubscription,
} from "@/lib/api/@types";
import type {
  ICreateCustomerInput,
  ICustomer,
  ICustomerStats,
  IInvoice,
  IPaginatedResponse,
  IPaymentMethod,
  ISubscription,
  IUpdateCustomerInput,
} from "@/types";

export interface ICustomersListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchCustomers(
  params: ICustomersListParams = {}
): Promise<IPaginatedResponse<ICustomer>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  const { data, meta } = await apiListRequest<IApiCustomer[]>(
    `/customers${buildQuery({ page, per_page: pageSize })}`
  );

  const mapped = (data ?? []).map(mapCustomer);
  const filtered = filterBySearch(mapped, params.search, (customer) =>
    `${customer.name} ${customer.email}`
  );

  return mapPaginatedResponse(filtered, meta, pageSize);
}

export async function fetchCustomersList(
  params: ICustomersListParams = {}
): Promise<ICustomer[]> {
  const result = await fetchCustomers(params);
  return result.data;
}

export async function fetchCustomer(id: string): Promise<ICustomer | null> {
  try {
    const data = await apiRequest<IApiCustomer>(`/customers/${id}`);
    return mapCustomer(data);
  } catch {
    return null;
  }
}

export async function fetchCustomerStats(id: string): Promise<ICustomerStats> {
  const [subscriptions, invoices] = await Promise.all([
    apiListRequest<IApiSubscription[]>(
      `/customers/${id}/subscriptions${buildQuery({ per_page: 100 })}`
    ),
    apiListRequest<IApiInvoice[]>(
      `/customers/${id}/invoices${buildQuery({ per_page: 100 })}`
    ),
  ]);

  const activeSubscriptions = (subscriptions.data ?? []).filter((sub) =>
    ["active", "trialing", "past_due"].includes(sub.state)
  ).length;

  const totalPaidMinor = (invoices.data ?? [])
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const totalPaid = fromMinorUnits(totalPaidMinor);

  return {
    activeSubscriptions,
    totalPaid,
    lifetimeValue: totalPaid,
  };
}

export async function fetchCustomerPaymentMethods(
  customerId: string
): Promise<IPaymentMethod[]> {
  try {
    const subscriptions = await apiListRequest<IApiSubscription[]>(
      `/customers/${customerId}/subscriptions${buildQuery({ per_page: 100 })}`
    );

    const paymentMethodIds = new Set<string>();
    const methods: IPaymentMethod[] = [];

    for (const subscription of subscriptions.data ?? []) {
      const sub = subscription as IApiSubscription & {
        payment_method?: IApiPaymentMethod;
        payment_method_id?: string;
      };

      if (sub.payment_method && !paymentMethodIds.has(sub.payment_method.id)) {
        paymentMethodIds.add(sub.payment_method.id);
        methods.push(mapPaymentMethod(sub.payment_method));
      }
    }

    return methods;
  } catch {
    return [];
  }
}

export async function fetchCustomerSubscriptions(
  customerId: string
): Promise<ISubscription[]> {
  const { data } = await apiListRequest<IApiSubscription[]>(
    `/customers/${customerId}/subscriptions${buildQuery({ per_page: 100 })}`
  );

  return (data ?? []).map(mapSubscription);
}

export async function fetchCustomerInvoices(
  customerId: string
): Promise<IInvoice[]> {
  const { data } = await apiListRequest<IApiInvoice[]>(
    `/customers/${customerId}/invoices${buildQuery({ per_page: 100 })}`
  );

  return (data ?? []).map(mapInvoice);
}

export async function createCustomer(
  input: ICreateCustomerInput
): Promise<ICustomer> {
  const data = await apiRequest<IApiCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      name: input.name,
      phone: input.phone ?? "",
      external_id: input.externalId ?? "",
      metadata: {},
    }),
  });
  return mapCustomer(data);
}

export async function updateCustomer(
  id: string,
  input: IUpdateCustomerInput
): Promise<ICustomer> {
  const data = await apiRequest<IApiCustomer>(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      email: input.email,
      name: input.name,
      phone: input.phone ?? "",
      external_id: input.externalId ?? "",
      metadata: {},
    }),
  });
  return mapCustomer(data);
}
