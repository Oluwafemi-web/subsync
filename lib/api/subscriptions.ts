import { DEFAULT_PAGE_SIZE } from "@/lib/api/config";
import { apiListRequest, apiRequest, apiRequestVoid } from "@/lib/api/client";
import { mapPaginatedResponse } from "@/lib/api/pagination";
import { buildQuery } from "@/lib/api/query";
import {
  filterBySearch,
  fromMinorUnits,
  mapSubscription,
  mapSubscriptionTransition,
} from "@/lib/api/resource-mappers";
import type {
  IApiCheckoutRequest,
  IApiCheckoutResponse,
  IApiSubscription,
  IApiSubscriptionTransition,
} from "@/lib/api/@types";
import type {
  ICheckoutInput,
  ICheckoutResult,
  IPaginatedResponse,
  IProrationEstimate,
  ISubscription,
  ISubscriptionFilters,
  ISubscriptionTransition,
} from "@/types";

export async function fetchSubscriptions(
  filters: ISubscriptionFilters = {}
): Promise<IPaginatedResponse<ISubscription>> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  const { data, meta } = await apiListRequest<IApiSubscription[]>(
    `/subscriptions${buildQuery({
      page,
      per_page: pageSize,
      state: filters.state,
      plan_id: filters.planId,
    })}`
  );

  let mapped = (data ?? []).map(mapSubscription);

  if (filters.state) {
    mapped = mapped.filter((sub) => sub.state === filters.state);
  }

  if (filters.planId) {
    mapped = mapped.filter((sub) => sub.planId === filters.planId);
  }

  if (filters.dateFrom) {
    mapped = mapped.filter((sub) => sub.createdAt >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    mapped = mapped.filter((sub) => sub.createdAt <= filters.dateTo!);
  }

  mapped = filterBySearch(mapped, filters.search, (sub) =>
    `${sub.customerName} ${sub.customerEmail} ${sub.id}`
  );

  return mapPaginatedResponse(mapped, meta, pageSize);
}

export async function fetchSubscription(
  id: string
): Promise<ISubscription | null> {
  try {
    const data = await apiRequest<IApiSubscription>(`/subscriptions/${id}`);
    return mapSubscription(data);
  } catch {
    return null;
  }
}

export async function fetchSubscriptionTransitions(
  id: string
): Promise<ISubscriptionTransition[]> {
  const data = await apiRequest<IApiSubscriptionTransition[]>(
    `/subscriptions/${id}/transitions`
  );

  return (data ?? []).map(mapSubscriptionTransition);
}

function mapCheckoutResponse(data: IApiCheckoutResponse): ICheckoutResult {
  return {
    subscriptionId: data.subscription_id,
    invoiceId: data.invoice_id,
    checkoutUrl: data.checkout_url,
    orderReference: data.order_reference,
    status: data.status,
  };
}

function buildCheckoutBody(input: ICheckoutInput): IApiCheckoutRequest {
  return {
    customer_id: input.customerId,
    plan_id: input.planId,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    send_checkout_email: input.sendCheckoutEmail,
  };
}

export async function startCheckout(input: ICheckoutInput): Promise<ICheckoutResult> {
  const data = await apiRequest<IApiCheckoutResponse>("/subscriptions/checkout", {
    method: "POST",
    body: JSON.stringify(buildCheckoutBody(input)),
  });
  return mapCheckoutResponse(data);
}

export async function resumeCheckout(
  subscriptionId: string,
  input: ICheckoutInput
): Promise<ICheckoutResult> {
  const data = await apiRequest<IApiCheckoutResponse>(
    `/subscriptions/${subscriptionId}/checkout`,
    {
      method: "POST",
      body: JSON.stringify(buildCheckoutBody(input)),
    }
  );
  return mapCheckoutResponse(data);
}

export async function cancelSubscription(
  id: string,
  cancelAtPeriodEnd: boolean,
  reason?: string
): Promise<void> {
  await apiRequestVoid(`/subscriptions/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({
      cancel_at_period_end: cancelAtPeriodEnd,
      reason: reason ?? "",
    }),
  });
}

export async function pauseSubscription(
  id: string,
  pauseEndsAt?: string
): Promise<void> {
  await apiRequestVoid(`/subscriptions/${id}/pause`, {
    method: "POST",
    body: JSON.stringify({ pause_ends_at: pauseEndsAt ?? null }),
  });
}

export async function resumeSubscription(id: string): Promise<void> {
  await apiRequestVoid(`/subscriptions/${id}/resume`, { method: "POST" });
}

export async function upgradeSubscription(
  id: string,
  newPlanId: string
): Promise<void> {
  await apiRequestVoid(`/subscriptions/${id}/upgrade`, {
    method: "POST",
    body: JSON.stringify({ new_plan_id: newPlanId }),
  });
}

export async function fetchUpgradePreview(
  id: string,
  newPlanId: string
): Promise<IProrationEstimate> {
  const data = await apiRequest<{ amount: number; description?: string }>(
    `/subscriptions/${id}/upgrade/preview${buildQuery({ new_plan_id: newPlanId })}`
  );

  return {
    amount: fromMinorUnits(data.amount),
    description: data.description ?? "Proration estimate",
  };
}
