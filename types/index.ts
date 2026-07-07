export type TSubscriptionState =
  | "incomplete"
  | "active"
  | "trialing"
  | "past_due"
  | "paused"
  | "canceled"
  | "expired";

export type TPlanInterval = "day" | "week" | "month" | "year" | "custom";

export type TPlanStatus = "active" | "archived";

export type TInvoiceStatus =
  | "draft"
  | "open"
  | "processing"
  | "paid"
  | "void"
  | "uncollectible";

export type TWebhookDeliveryStatus = "success" | "failed" | "pending";

export type TActivityType =
  | "subscription_created"
  | "subscription_canceled"
  | "subscription_paused"
  | "payment_succeeded"
  | "payment_failed"
  | "invoice_paid"
  | "customer_created"
  | "plan_created";

export interface IUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
}

export interface IAuthSession {
  accessToken: string;
  expiresAt: string;
  user: IUser;
}

export interface ILoginResult {
  session: IAuthSession;
  nombaWebhookUrl: string;
}

export interface IRegisterResult extends ILoginResult {
  apiKey: string;
}

export interface IMerchant {
  id: string;
  name: string;
  email: string;
  website?: string;
  logoUrl?: string;
  brandColor?: string;
  billingEmail?: string;
  onboardingComplete: boolean;
}

export interface IPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "NGN";
  interval: TPlanInterval;
  customIntervalDays?: number;
  trialDays: number;
  features: string[];
  status: TPlanStatus;
  activeSubscribers: number;
  createdAt: string;
}

export interface ISubscription {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planName: string;
  state: TSubscriptionState;
  mrr: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  canceledAt?: string;
  pausedUntil?: string;
  createdAt: string;
}

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  activeSubscriptions: number;
  totalPaid: number;
  joinedAt: string;
}

export interface IInvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IInvoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subscriptionId?: string;
  status: TInvoiceStatus;
  amount: number;
  currency: "NGN";
  dueDate: string;
  paidAt?: string;
  lineItems: IInvoiceLineItem[];
  createdAt: string;
}

export interface IPaymentMethod {
  id: string;
  customerId: string;
  type: "card" | "bank_transfer";
  brand?: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface IWebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  lastDeliveryStatus: TWebhookDeliveryStatus;
  lastDeliveryAt?: string;
  createdAt: string;
}

export interface IWebhookDelivery {
  id: string;
  endpointId: string;
  eventType: string;
  httpStatus: number;
  attempt: number;
  duration: number;
  requestBody: string;
  responseBody: string;
  createdAt: string;
}

export interface IAnalyticsDateRange {
  from: string;
  to: string;
}

export interface IOverviewMetrics {
  mrr: number;
  mrrChangePercent: number;
  activeSubscribers: number;
  churnRate: number;
  dunningRecoveryRate: number;
}

export interface IRevenueDataPoint {
  date: string;
  revenue: number;
}

export interface ISubscriptionBreakdown {
  state: TSubscriptionState;
  count: number;
}

export interface IActivityEvent {
  id: string;
  type: TActivityType;
  title: string;
  description: string;
  entityId: string;
  entityType: "subscription" | "invoice" | "customer" | "plan";
  createdAt: string;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface IDunningStep {
  id: string;
  day: number;
  action: string;
  emailTemplate: string;
  enabled: boolean;
}

export type TNombaEnv = "sandbox" | "production";

export interface INombaCredentials {
  accountId: string;
  clientId: string;
  clientSecret: string;
  subAccountId?: string;
  env: TNombaEnv;
}

export interface ISettings {
  merchant: IMerchant;
  nomba: INombaCredentials;
  apiKey: string;
  webhookUrl: string;
  webhookSecret: string;
  dunningSteps: IDunningStep[];
}

export interface IPlanStats {
  activeSubscriptions: number;
  mrr: number;
  averageAgeDays: number;
}

export interface ICustomerStats {
  activeSubscriptions: number;
  totalPaid: number;
  lifetimeValue: number;
}

export interface ISubscriptionTransition {
  id: string;
  fromState: TSubscriptionState | null;
  toState: TSubscriptionState;
  reason?: string;
  createdAt: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ICustomerFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface IPlanFilters {
  page?: number;
  pageSize?: number;
}

export interface ISubscriptionFilters {
  search?: string;
  state?: TSubscriptionState;
  planId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface IInvoiceFilters {
  status?: TInvoiceStatus;
  dateFrom?: string;
  dateTo?: string;
  subscriptionId?: string;
  amountMin?: number;
  amountMax?: number;
  page?: number;
  pageSize?: number;
}

export interface IProrationEstimate {
  amount: number;
  description: string;
}

export interface ICheckoutResult {
  subscriptionId: string;
  invoiceId?: string | null;
  checkoutUrl: string;
  orderReference: string;
  status: string;
}

export interface IPortalTokenResult {
  token: string;
  expiresAt?: string;
}

export interface ICreatePlanInput {
  name: string;
  description?: string;
  price: number;
  interval: TPlanInterval;
  customIntervalDays?: number;
  trialDays?: number;
  features?: string[];
}

export interface IUpdatePlanInput extends ICreatePlanInput {}

export interface ICreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  externalId?: string;
}

export interface IUpdateCustomerInput extends ICreateCustomerInput {}

export interface ICheckoutInput {
  customerId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
  sendCheckoutEmail?: boolean;
}

export interface ICreateWebhookInput {
  url: string;
  events: string[];
  isActive?: boolean;
}

export interface IUpdateWebhookInput extends ICreateWebhookInput {}
