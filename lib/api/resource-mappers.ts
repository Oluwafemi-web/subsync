import type {
  IApiCustomer,
  IApiInvoice,
  IApiInvoiceLineItem,
  IApiNombaSettings,
  IApiPaymentMethod,
  IApiPlan,
  IApiPlanStats,
  IApiSettings,
  IApiSubscription,
  IApiSubscriptionTransition,
  IApiWebhookDelivery,
  IApiWebhookEndpoint,
  TApiPlanInterval,
} from "@/lib/api/@types";
import type {
  ICustomer,
  IInvoice,
  IInvoiceLineItem,
  INombaCredentials,
  IPaymentMethod,
  IPlan,
  IPlanStats,
  ISettings,
  ISubscription,
  ISubscriptionTransition,
  TInvoiceStatus,
  TPaymentMethodType,
  TPlanInterval,
  TPlanStatus,
  TSubscriptionState,
  TWebhookDeliveryStatus,
  IWebhookDelivery,
  IWebhookEndpoint,
  IMerchant,
  IDunningStep,
} from "@/types";

/** Convert API minor units (kobo) to major units (naira) for display. */
export function fromMinorUnits(amount: number): number {
  return amount / 100;
}

/** Convert major units (naira) to API minor units (kobo). */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export function toApiInterval(
  interval: TPlanInterval
): TApiPlanInterval {
  switch (interval) {
    case "month":
      return "monthly";
    case "year":
      return "annual";
    case "custom":
      return "custom";
    default:
      return "monthly";
  }
}

function mapPlanInterval(interval: TApiPlanInterval): TPlanInterval {
  switch (interval) {
    case "monthly":
      return "month";
    case "annual":
      return "year";
    case "custom":
      return "custom";
    default:
      return "month";
  }
}

function mapSubscriptionState(state: string): TSubscriptionState {
  const allowed: TSubscriptionState[] = [
    "incomplete",
    "active",
    "trialing",
    "past_due",
    "paused",
    "canceled",
    "expired",
  ];

  if (allowed.includes(state as TSubscriptionState)) {
    return state as TSubscriptionState;
  }

  return "active";
}

function mapInvoiceStatus(status: string): TInvoiceStatus {
  const allowed: TInvoiceStatus[] = [
    "draft",
    "open",
    "processing",
    "paid",
    "void",
    "uncollectible",
  ];

  if (allowed.includes(status as TInvoiceStatus)) {
    return status as TInvoiceStatus;
  }

  return "open";
}

function mapDeliveryStatus(status?: string): TWebhookDeliveryStatus {
  if (status === "success" || status === "failed" || status === "pending") {
    return status;
  }

  return "pending";
}

export function mapPlan(api: IApiPlan): IPlan {
  return {
    id: api.id,
    name: api.name,
    description: api.description ?? "",
    price: fromMinorUnits(api.amount),
    currency: "NGN",
    interval: mapPlanInterval(api.interval),
    customIntervalDays: api.interval_days,
    trialDays: api.trial_days ?? 0,
    features: api.features ?? [],
    status: api.archived_at ? "archived" : "active",
    activeSubscribers: api.active_subscriptions ?? 0,
    createdAt: api.created_at,
  };
}

export function mapPlanStats(api: IApiPlanStats): IPlanStats {
  return {
    activeSubscriptions: api.active_subscriptions ?? 0,
    mrr: 0,
    averageAgeDays: 0,
  };
}

export function mapCustomer(api: IApiCustomer): ICustomer {
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    phone: api.phone,
    externalId: api.external_id,
    activeSubscriptions: api.active_subscriptions ?? 0,
    totalPaid: fromMinorUnits(api.total_paid ?? 0),
    joinedAt: api.created_at,
  };
}

export function mapSubscription(api: IApiSubscription): ISubscription {
  const customerName =
    api.customer_name ?? api.customer?.name ?? "Unknown customer";
  const customerEmail =
    api.customer_email ?? api.customer?.email ?? "";
  const planName = api.plan_name ?? api.plan?.name ?? "Unknown plan";

  return {
    id: api.id,
    customerId: api.customer_id,
    customerName,
    customerEmail,
    planId: api.plan_id,
    planName,
    state: mapSubscriptionState(api.state),
    mrr: fromMinorUnits(api.mrr ?? 0),
    currentPeriodStart: api.current_period_start ?? api.created_at,
    currentPeriodEnd: api.current_period_end ?? api.created_at,
    trialEnd: api.trial_end ?? undefined,
    canceledAt: api.canceled_at ?? undefined,
    pausedUntil: api.pause_ends_at ?? api.paused_until ?? undefined,
    createdAt: api.created_at,
    paymentMethod: api.payment_method
      ? mapPaymentMethod(api.payment_method)
      : undefined,
    fallbackPaymentMethod: api.fallback_payment_method
      ? mapPaymentMethod(api.fallback_payment_method)
      : undefined,
  };
}

export function mapSubscriptionTransition(
  api: IApiSubscriptionTransition
): ISubscriptionTransition {
  return {
    id: api.id,
    fromState: api.from_state
      ? mapSubscriptionState(api.from_state)
      : null,
    toState: mapSubscriptionState(api.to_state),
    reason: api.reason,
    createdAt: api.created_at,
  };
}

function mapInvoiceLineItem(api: IApiInvoiceLineItem): IInvoiceLineItem {
  return {
    description: api.description,
    quantity: api.quantity,
    unitPrice: fromMinorUnits(api.unit_price),
    amount: fromMinorUnits(api.amount),
  };
}

export function mapInvoice(api: IApiInvoice): IInvoice {
  const customer = api.customer ? mapCustomer(api.customer) : undefined;
  const customerName =
    api.customer_name ?? customer?.name ?? "Unknown customer";
  const customerEmail = api.customer_email ?? customer?.email ?? "";
  const customerPhone = customer?.phone;

  const amountDueMinor = api.amount_due ?? api.amount ?? 0;
  const amountPaidMinor =
    api.amount_paid ??
    (api.status === "paid" ? (api.amount ?? api.amount_due ?? 0) : 0);

  return {
    id: api.id,
    number: api.number ?? api.id.slice(0, 8).toUpperCase(),
    customerId: api.customer_id,
    customerName,
    customerEmail,
    customerPhone,
    subscriptionId: api.subscription_id ?? api.subscription?.id,
    status: mapInvoiceStatus(api.status),
    amountDue: fromMinorUnits(amountDueMinor),
    amountPaid: fromMinorUnits(amountPaidMinor),
    amountDueDisplay: api.amount_due_display,
    amountPaidDisplay: api.amount_paid_display,
    currency: "NGN",
    dueDate: api.due_date,
    paidAt: api.paid_at ?? undefined,
    lineItems: (api.line_items ?? []).map(mapInvoiceLineItem),
    createdAt: api.created_at,
    customer,
    subscription: api.subscription
      ? mapSubscription(api.subscription)
      : undefined,
  };
}

function mapPaymentMethodType(type: string): TPaymentMethodType {
  switch (type) {
    case "card":
    case "tokenized_card":
      return "card";
    case "direct_debit":
      return "direct_debit";
    case "bank_transfer":
      return "bank_transfer";
    default:
      return "card";
  }
}

/** Parse an "MM/YY" (or "MM/YYYY") expiry string into month and year. */
function parseCardExpiry(expiry?: string): {
  month?: number;
  year?: number;
} {
  if (!expiry) {
    return {};
  }

  const [rawMonth, rawYear] = expiry.split("/");
  const month = Number(rawMonth);
  const year = Number(rawYear);

  if (!Number.isFinite(month) || !Number.isFinite(year)) {
    return {};
  }

  return {
    month,
    year: year < 100 ? 2000 + year : year,
  };
}

export function mapPaymentMethod(api: IApiPaymentMethod): IPaymentMethod {
  const { month, year } = parseCardExpiry(api.card_expiry);

  return {
    id: api.id,
    customerId: api.customer_id,
    type: mapPaymentMethodType(api.type),
    brand: api.card_brand,
    last4: api.card_last4,
    expiryMonth: api.expiry_month ?? month,
    expiryYear: api.expiry_year ?? year,
    mandateStatus: api.mandate_status,
    isDefault: api.is_default,
  };
}

export function mapWebhookEndpoint(api: IApiWebhookEndpoint): IWebhookEndpoint {
  return {
    id: api.id,
    url: api.url,
    events: api.events,
    active: api.is_active,
    secret: api.secret ?? api.signing_secret ?? "",
    lastDeliveryStatus: mapDeliveryStatus(api.last_delivery_status),
    lastDeliveryAt: api.last_delivery_at ?? undefined,
    createdAt: api.created_at,
  };
}

export function mapWebhookDelivery(api: IApiWebhookDelivery): IWebhookDelivery {
  return {
    id: api.id,
    endpointId: api.endpoint_id,
    eventType: api.event_type,
    httpStatus: api.http_status,
    attempt: api.attempt,
    duration: api.duration_ms ?? api.duration ?? 0,
    requestBody: api.request_body ?? "",
    responseBody: api.response_body ?? "",
    createdAt: api.created_at,
  };
}

export function mapSettings(
  settings: IApiSettings,
  nomba: IApiNombaSettings,
  tenantId: string
): ISettings {
  const nombaCredentials: INombaCredentials = {
    accountId: nomba.account_id ?? "",
    clientId: nomba.client_id ?? "",
    clientSecret: nomba.client_secret ?? "",
    subAccountId: nomba.sub_account_id,
    env: nomba.env ?? "sandbox",
  };

  const merchant: IMerchant = {
    id: settings.id ?? tenantId,
    name: settings.name ?? "",
    email: settings.email ?? "",
    website: settings.website,
    logoUrl: settings.logo_url,
    brandColor: settings.brand_color,
    billingEmail: settings.billing_email_from_name,
    onboardingComplete: true,
  };

  const dunningSteps: IDunningStep[] = (settings.dunning?.steps ?? []).map(
    (step, index) => ({
      id: `dun_${index + 1}`,
      day: step.delay_days,
      action: step.action,
      emailTemplate: step.email_template ?? "",
      enabled: step.enabled ?? true,
    })
  );

  return {
    merchant,
    nomba: nombaCredentials,
    apiKey: settings.api_key ?? settings.api_key_masked ?? "",
    webhookUrl: nomba.webhook_url ?? "",
    webhookSecret: nomba.webhook_secret ?? "",
    dunningSteps,
  };
}

export function filterBySearch<T>(
  items: T[],
  search: string | undefined,
  getSearchableText: (item: T) => string
): T[] {
  if (!search?.trim()) {
    return items;
  }

  const query = search.toLowerCase();

  return items.filter((item) =>
    getSearchableText(item).toLowerCase().includes(query)
  );
}
