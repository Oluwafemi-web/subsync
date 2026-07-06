import { isMockMode } from "@/lib/api/config";
import * as analyticsApi from "@/lib/api/analytics";
import * as customersApi from "@/lib/api/customers";
import * as invoicesApi from "@/lib/api/invoices";
import * as plansApi from "@/lib/api/plans";
import * as portalApi from "@/lib/api/portal";
import * as settingsApi from "@/lib/api/settings";
import * as subscriptionsApi from "@/lib/api/subscriptions";
import * as webhooksApi from "@/lib/api/webhooks";
import * as mock from "@/lib/mock-api";
import type {
  ICheckoutInput,
  ICreateCustomerInput,
  ICreatePlanInput,
  ICreateWebhookInput,
  IAnalyticsDateRange,
  ICustomerFilters,
  IDunningStep,
  IInvoiceFilters,
  IPlanFilters,
  ISubscriptionFilters,
  IUpdateCustomerInput,
  IUpdatePlanInput,
  IUpdateWebhookInput,
} from "@/types";
import type {
  TNombaSettingsValues,
  TGeneralSettingsValues,
} from "@/lib/schemas/dashboard";

// ─── Overview ────────────────────────────────────────────────────────────────

export async function getOverviewMetrics(range?: IAnalyticsDateRange) {
  if (isMockMode()) {
    return mock.getOverviewMetrics();
  }
  return analyticsApi.fetchOverviewMetrics(range);
}

export async function getRevenueChart(range?: IAnalyticsDateRange) {
  if (isMockMode()) {
    return mock.getRevenueChart();
  }
  return analyticsApi.fetchRevenueChart(range);
}

export const getSubscriptionBreakdown = isMockMode()
  ? mock.getSubscriptionBreakdown
  : analyticsApi.fetchSubscriptionBreakdown;

export const getRecentActivity = isMockMode()
  ? mock.getRecentActivity
  : analyticsApi.fetchRecentActivity;

// ─── Notifications (mock only) ─────────────────────────────────────────────

export const getNotifications = mock.getNotifications;
export const markNotificationRead = mock.markNotificationRead;

// ─── Plans ───────────────────────────────────────────────────────────────────

export async function getPlans(filters: IPlanFilters = {}) {
  if (isMockMode()) {
    return mock.getPlans();
  }
  return plansApi.fetchPlansList(filters);
}

export async function getPlansPaginated(filters: IPlanFilters = {}) {
  if (isMockMode()) {
    const plans = await mock.getPlans();
    return {
      data: plans,
      total: plans.length,
      page: 1,
      pageSize: plans.length,
      totalPages: 1,
    };
  }
  return plansApi.fetchPlans(filters);
}

export const getPlan = isMockMode() ? mock.getPlan : plansApi.fetchPlan;
export const getPlanStats = isMockMode()
  ? mock.getPlanStats
  : plansApi.fetchPlanStats;

export async function createPlan(input: ICreatePlanInput) {
  if (isMockMode()) {
    return mock.createPlan({
      name: input.name,
      description: input.description ?? "",
      price: input.price,
      currency: "NGN",
      interval: input.interval,
      customIntervalDays: input.customIntervalDays,
      trialDays: input.trialDays ?? 0,
      features: input.features ?? [],
    });
  }
  return plansApi.createPlan(input);
}

export async function updatePlan(id: string, input: IUpdatePlanInput) {
  if (isMockMode()) {
    const plan = await mock.getPlan(id);
    if (!plan) throw new Error("Plan not found");
    return { ...plan, ...input, description: input.description ?? plan.description };
  }
  return plansApi.updatePlan(id, input);
}

export async function archivePlan(id: string) {
  if (isMockMode()) {
    return;
  }
  return plansApi.archivePlan(id);
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export const getSubscriptions = isMockMode()
  ? mock.getSubscriptions
  : subscriptionsApi.fetchSubscriptions;

export const getSubscription = isMockMode()
  ? mock.getSubscription
  : subscriptionsApi.fetchSubscription;

export const getSubscriptionTransitions = isMockMode()
  ? mock.getSubscriptionTransitions
  : subscriptionsApi.fetchSubscriptionTransitions;

export async function startCheckout(input: ICheckoutInput) {
  if (isMockMode()) {
    return {
      subscriptionId: `sub_${Date.now()}`,
      checkoutUrl: "https://checkout.nomba.com/mock",
      orderReference: `ord_${Date.now()}`,
      status: "incomplete",
    };
  }
  return subscriptionsApi.startCheckout(input);
}

export async function resumeCheckout(
  subscriptionId: string,
  input: ICheckoutInput
) {
  if (isMockMode()) {
    return startCheckout(input);
  }
  return subscriptionsApi.resumeCheckout(subscriptionId, input);
}

export const cancelSubscription = isMockMode()
  ? (id: string, immediate: boolean) => mock.cancelSubscription(id, immediate)
  : (id: string, cancelAtPeriodEnd: boolean, reason?: string) =>
      subscriptionsApi.cancelSubscription(id, cancelAtPeriodEnd, reason);

export const pauseSubscription = isMockMode()
  ? mock.pauseSubscription
  : subscriptionsApi.pauseSubscription;

export const resumeSubscription = isMockMode()
  ? async (_id: string) => {}
  : subscriptionsApi.resumeSubscription;

export const upgradeSubscription = isMockMode()
  ? mock.upgradeSubscription
  : subscriptionsApi.upgradeSubscription;

export const getProrationEstimate = isMockMode()
  ? mock.getProrationEstimate
  : subscriptionsApi.fetchUpgradePreview;

export async function createPortalToken(subscriptionId: string) {
  if (isMockMode()) {
    return { token: `portal_${subscriptionId}` };
  }
  return portalApi.createPortalToken(subscriptionId);
}

export const buildPortalUrl = portalApi.buildPortalUrl;

// ─── Customers ───────────────────────────────────────────────────────────────

export async function getCustomers(filters: ICustomerFilters = {}) {
  if (isMockMode()) {
    return mock.getCustomers(filters.search);
  }
  const result = await customersApi.fetchCustomers(filters);
  return result.data;
}

export async function getCustomersPaginated(filters: ICustomerFilters = {}) {
  if (isMockMode()) {
    const customers = await mock.getCustomers(filters.search);
    return {
      data: customers,
      total: customers.length,
      page: 1,
      pageSize: customers.length,
      totalPages: 1,
    };
  }
  return customersApi.fetchCustomers(filters);
}

export const getCustomer = isMockMode()
  ? mock.getCustomer
  : customersApi.fetchCustomer;

export const getCustomerStats = isMockMode()
  ? mock.getCustomerStats
  : customersApi.fetchCustomerStats;

export const getCustomerPaymentMethods = isMockMode()
  ? mock.getCustomerPaymentMethods
  : customersApi.fetchCustomerPaymentMethods;

export async function createCustomer(input: ICreateCustomerInput) {
  if (isMockMode()) {
    return {
      id: `cus_${Date.now()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      activeSubscriptions: 0,
      totalPaid: 0,
      joinedAt: new Date().toISOString(),
    };
  }
  return customersApi.createCustomer(input);
}

export async function updateCustomer(id: string, input: IUpdateCustomerInput) {
  if (isMockMode()) {
    const customer = await mock.getCustomer(id);
    if (!customer) throw new Error("Customer not found");
    return { ...customer, ...input };
  }
  return customersApi.updateCustomer(id, input);
}

// ─── Invoices ────────────────────────────────────────────────────────────────

export const getInvoices = isMockMode()
  ? mock.getInvoices
  : invoicesApi.fetchInvoices;

export const getInvoice = isMockMode()
  ? mock.getInvoice
  : invoicesApi.fetchInvoice;

export const voidInvoice = isMockMode()
  ? mock.voidInvoice
  : invoicesApi.voidInvoice;

export const retryInvoiceCharge = isMockMode()
  ? mock.retryInvoiceCharge
  : invoicesApi.retryInvoice;

export const downloadInvoicePdf = isMockMode()
  ? async (_id: string) => {}
  : invoicesApi.downloadInvoicePdf;

// ─── Webhooks ────────────────────────────────────────────────────────────────

export const getWebhooks = isMockMode()
  ? mock.getWebhooks
  : webhooksApi.fetchWebhooks;

export const getWebhook = isMockMode()
  ? mock.getWebhook
  : webhooksApi.fetchWebhook;

export const getWebhookDeliveries = isMockMode()
  ? mock.getWebhookDeliveries
  : webhooksApi.fetchWebhookDeliveries;

export async function createWebhookEndpoint(input: ICreateWebhookInput) {
  if (isMockMode()) {
    return mock.createWebhookEndpoint({
      url: input.url,
      events: input.events,
    });
  }
  return webhooksApi.createWebhookEndpoint(input);
}

export async function updateWebhookEndpoint(
  id: string,
  input: IUpdateWebhookInput
) {
  if (isMockMode()) {
    const webhook = await mock.getWebhook(id);
    if (!webhook) throw new Error("Webhook not found");
    return { ...webhook, ...input, active: input.isActive ?? webhook.active };
  }
  return webhooksApi.updateWebhookEndpoint(id, input);
}

export const deleteWebhookEndpoint = isMockMode()
  ? mock.deleteWebhookEndpoint
  : webhooksApi.deleteWebhookEndpoint;

export const retryWebhookDelivery = mock.retryWebhookDelivery;

// ─── Settings ────────────────────────────────────────────────────────────────

export const getSettings = isMockMode()
  ? mock.getSettings
  : settingsApi.fetchSettings;

export const verifyNombaCredentials = isMockMode()
  ? mock.verifyNombaCredentials
  : settingsApi.verifyNombaCredentials;

export const rotateApiKey = isMockMode()
  ? mock.rotateApiKey
  : settingsApi.rotateApiKey;

export async function updateGeneralSettings(values: TGeneralSettingsValues) {
  if (isMockMode()) {
    return mock.getSettings();
  }
  return settingsApi.updateGeneralSettings(values);
}

export async function updateNombaSettings(values: TNombaSettingsValues) {
  if (isMockMode()) {
    return mock.getSettings();
  }
  return settingsApi.updateNombaSettings(values);
}

export async function updateDunningSettings(steps: IDunningStep[]) {
  if (isMockMode()) {
    return mock.getSettings();
  }
  return settingsApi.updateDunningSettings(steps);
}

export const generateApiKey = mock.generateApiKey;
