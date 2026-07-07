import type { TSignupPayload } from "@/lib/auth/schemas";
import { delay } from "@/lib/delay";
import activityData from "@/mocks/activity.json";
import customersData from "@/mocks/customers.json";
import invoicesData from "@/mocks/invoices.json";
import notificationsData from "@/mocks/notifications.json";
import overviewMetricsData from "@/mocks/overview-metrics.json";
import paymentMethodsData from "@/mocks/payment-methods.json";
import plansData from "@/mocks/plans.json";
import revenueChartData from "@/mocks/revenue-chart.json";
import settingsData from "@/mocks/settings.json";
import subscriptionBreakdownData from "@/mocks/subscription-breakdown.json";
import subscriptionTransitionsData from "@/mocks/subscription-transitions.json";
import subscriptionsData from "@/mocks/subscriptions.json";
import webhookDeliveriesData from "@/mocks/webhook-deliveries.json";
import webhooksData from "@/mocks/webhooks.json";
import type {
  IActivityEvent,
  ICustomer,
  ICustomerStats,
  IInvoice,
  IInvoiceFilters,
  INotification,
  IOverviewMetrics,
  IPaginatedResponse,
  IPaymentMethod,
  IPlan,
  IPlanStats,
  IProrationEstimate,
  IRevenueDataPoint,
  ISettings,
  ISubscription,
  ISubscriptionBreakdown,
  ISubscriptionFilters,
  ISubscriptionTransition,
  IWebhookDelivery,
  IWebhookEndpoint,
} from "@/types";

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  await delay();
  if (email === "demo@subsync.ng" && password === "password") {
    return { success: true };
  }
  return { success: false, error: "Invalid credentials" };
}

export async function signup(
  values: TSignupPayload
): Promise<{ success: boolean; error?: string }> {
  await delay();
  if (
    !values.email.trim() ||
    !values.password ||
    !values.name.trim()
  ) {
    return { success: false, error: "All fields are required" };
  }
  if (values.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }
  if (
    !values.nomba_client_id.trim() ||
    !values.nomba_client_secret.trim()
  ) {
    return { success: false, error: "Nomba API credentials are required" };
  }
  if (!values.nomba_account_id.trim()) {
    return { success: false, error: "Nomba account ID is required" };
  }
  if (values.email === "demo@subsync.ng") {
    return { success: false, error: "An account with this email already exists" };
  }
  return { success: true };
}

// ─── Overview ────────────────────────────────────────────────────────────────

export async function getOverviewMetrics(): Promise<IOverviewMetrics> {
  await delay();
  return overviewMetricsData as IOverviewMetrics;
}

export async function getRevenueChart(): Promise<IRevenueDataPoint[]> {
  await delay();
  return revenueChartData as IRevenueDataPoint[];
}

export async function getSubscriptionBreakdown(): Promise<
  ISubscriptionBreakdown[]
> {
  await delay();
  return subscriptionBreakdownData as ISubscriptionBreakdown[];
}

export async function getRecentActivity(): Promise<IActivityEvent[]> {
  await delay();
  return activityData as IActivityEvent[];
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function getNotifications(): Promise<INotification[]> {
  await delay();
  return notificationsData as INotification[];
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(200);
  const notification = (notificationsData as INotification[]).find(
    (n) => n.id === id
  );
  if (notification) notification.read = true;
}

// ─── Plans ───────────────────────────────────────────────────────────────────

export async function getPlans(): Promise<IPlan[]> {
  await delay();
  return plansData as IPlan[];
}

export async function getPlan(id: string): Promise<IPlan | null> {
  await delay();
  return (plansData as IPlan[]).find((p) => p.id === id) ?? null;
}

export async function getPlanStats(id: string): Promise<IPlanStats> {
  await delay();
  const plan = (plansData as IPlan[]).find((p) => p.id === id);
  const subs = (subscriptionsData as ISubscription[]).filter(
    (s) => s.planId === id && s.state !== "canceled"
  );
  return {
    activeSubscriptions: subs.length,
    mrr: subs.reduce((sum, s) => sum + s.mrr, 0),
    averageAgeDays: plan ? 120 : 0,
  };
}

export async function createPlan(
  plan: Omit<IPlan, "id" | "activeSubscribers" | "createdAt" | "status">
): Promise<IPlan> {
  await delay();
  const newPlan: IPlan = {
    ...plan,
    id: `plan_${Date.now()}`,
    status: "active",
    activeSubscribers: 0,
    createdAt: new Date().toISOString(),
  };
  (plansData as IPlan[]).push(newPlan);
  return newPlan;
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function getSubscriptions(
  filters: ISubscriptionFilters = {}
): Promise<IPaginatedResponse<ISubscription>> {
  await delay();
  const {
    search,
    state,
    planId,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 25,
  } = filters;

  let filtered = [...(subscriptionsData as ISubscription[])];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.customerName.toLowerCase().includes(q) ||
        s.customerEmail.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }
  if (state) filtered = filtered.filter((s) => s.state === state);
  if (planId) filtered = filtered.filter((s) => s.planId === planId);
  if (dateFrom)
    filtered = filtered.filter((s) => s.createdAt >= dateFrom);
  if (dateTo) filtered = filtered.filter((s) => s.createdAt <= dateTo);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getSubscription(
  id: string
): Promise<ISubscription | null> {
  await delay();
  return (subscriptionsData as ISubscription[]).find((s) => s.id === id) ?? null;
}

export async function getSubscriptionTransitions(
  _id: string
): Promise<ISubscriptionTransition[]> {
  await delay();
  return subscriptionTransitionsData as ISubscriptionTransition[];
}

export async function cancelSubscription(
  _id: string,
  _immediate: boolean
): Promise<void> {
  await delay();
}

export async function pauseSubscription(
  _id: string,
  _until?: string
): Promise<void> {
  await delay();
}

export async function upgradeSubscription(
  _id: string,
  _planId: string
): Promise<void> {
  await delay();
}

export async function getProrationEstimate(
  _subscriptionId: string,
  _planId?: string
): Promise<IProrationEstimate> {
  await delay(300);
  return {
    amount: 4250,
    description: "Prorated credit for remaining 18 days on current plan",
  };
}

// ─── Customers ───────────────────────────────────────────────────────────────

export async function getCustomers(
  search?: string
): Promise<ICustomer[]> {
  await delay();
  let customers = [...(customersData as ICustomer[])];
  if (search) {
    const q = search.toLowerCase();
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }
  return customers;
}

export async function getCustomer(id: string): Promise<ICustomer | null> {
  await delay();
  return (customersData as ICustomer[]).find((c) => c.id === id) ?? null;
}

export async function getCustomerStats(id: string): Promise<ICustomerStats> {
  await delay();
  const customer = (customersData as ICustomer[]).find((c) => c.id === id);
  return {
    activeSubscriptions: customer?.activeSubscriptions ?? 0,
    totalPaid: customer?.totalPaid ?? 0,
    lifetimeValue: (customer?.totalPaid ?? 0) * 1.2,
  };
}

export async function getCustomerPaymentMethods(
  customerId: string
): Promise<IPaymentMethod[]> {
  await delay();
  return (paymentMethodsData as IPaymentMethod[]).filter(
    (pm) => pm.customerId === customerId
  );
}

// ─── Invoices ────────────────────────────────────────────────────────────────

export async function getInvoices(
  filters: IInvoiceFilters = {}
): Promise<IPaginatedResponse<IInvoice>> {
  await delay();
  const {
    status,
    dateFrom,
    dateTo,
    subscriptionId,
    amountMin,
    amountMax,
    page = 1,
    pageSize = 25,
  } = filters;

  let filtered = [...(invoicesData as IInvoice[])];

  if (status) filtered = filtered.filter((i) => i.status === status);
  if (subscriptionId)
    filtered = filtered.filter((i) => i.subscriptionId === subscriptionId);
  if (dateFrom) filtered = filtered.filter((i) => i.createdAt >= dateFrom);
  if (dateTo) filtered = filtered.filter((i) => i.createdAt <= dateTo);
  if (amountMin !== undefined)
    filtered = filtered.filter((i) => i.amountDue >= amountMin);
  if (amountMax !== undefined)
    filtered = filtered.filter((i) => i.amountDue <= amountMax);

  const total = filtered.length;
  const start = (page - 1) * pageSize;

  return {
    data: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getInvoice(id: string): Promise<IInvoice | null> {
  await delay();
  return (invoicesData as IInvoice[]).find((i) => i.id === id) ?? null;
}

export async function voidInvoice(_id: string): Promise<void> {
  await delay();
}

export async function retryInvoiceCharge(_id: string): Promise<void> {
  await delay();
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

export async function getWebhooks(): Promise<IWebhookEndpoint[]> {
  await delay();
  return webhooksData as IWebhookEndpoint[];
}

export async function getWebhook(id: string): Promise<IWebhookEndpoint | null> {
  await delay();
  return (webhooksData as IWebhookEndpoint[]).find((w) => w.id === id) ?? null;
}

export async function getWebhookDeliveries(
  endpointId: string
): Promise<IWebhookDelivery[]> {
  await delay();
  return (webhookDeliveriesData as IWebhookDelivery[]).filter(
    (d) => d.endpointId === endpointId
  );
}

export async function createWebhookEndpoint(
  data: Pick<IWebhookEndpoint, "url" | "events">
): Promise<IWebhookEndpoint> {
  await delay();
  const endpoint: IWebhookEndpoint = {
    ...data,
    id: `wh_${Date.now()}`,
    active: true,
    secret: `whsec_****${Math.random().toString(36).slice(2, 6)}`,
    lastDeliveryStatus: "pending",
    createdAt: new Date().toISOString(),
  };
  (webhooksData as IWebhookEndpoint[]).push(endpoint);
  return endpoint;
}

export async function deleteWebhookEndpoint(_id: string): Promise<void> {
  await delay();
}

export async function retryWebhookDelivery(_id: string): Promise<void> {
  await delay();
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<ISettings> {
  await delay();
  return settingsData as ISettings;
}

export async function verifyNombaCredentials(credentials: {
  accountId: string;
  clientId: string;
  clientSecret: string;
}): Promise<{ success: boolean; error?: string }> {
  await delay(800);
  if (credentials.clientSecret === "invalid") {
    return {
      success: false,
      error: "Invalid client credentials. Please check your Nomba API keys.",
    };
  }
  return { success: true };
}

export async function generateApiKey(): Promise<string> {
  await delay();
  return `sk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

export async function rotateApiKey(): Promise<string> {
  await delay();
  return generateApiKey();
}
