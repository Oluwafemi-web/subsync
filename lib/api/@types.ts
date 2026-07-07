export interface IApiMeta {
  request_id: string;
  page?: number;
  per_page?: number;
  total?: number;
}

export interface IApiErrorBody {
  code: string;
  message: string;
}

export interface IApiEnvelope<T> {
  data: T | null;
  meta?: IApiMeta;
  error?: IApiErrorBody | null;
}

export interface IApiUser {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
}

export interface IApiTenant {
  id: string;
  name: string;
  email?: string;
}

export interface IApiNombaInfo {
  webhook_url: string;
}

export interface IApiAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: string;
}

export interface IApiLoginResponse extends IApiAuthTokens {
  user: IApiUser;
  tenant: IApiTenant;
  nomba: IApiNombaInfo;
}

export interface IApiRegisterResponse extends IApiLoginResponse {
  api_key: string;
}

export type TApiPlanInterval = "monthly" | "annual" | "custom";

export interface IApiRegisterRequest {
  email: string;
  password: string;
  name: string;
  nomba_client_id: string;
  nomba_client_secret: string;
  nomba_account_id: string;
  nomba_sub_account_id?: string;
  nomba_env: "sandbox" | "production";
  nomba_webhook_secret?: string;
}

export interface IApiLoginRequest {
  email: string;
  password: string;
}

export interface IApiForgotPasswordRequest {
  email: string;
}

export interface IApiForgotPasswordResponse {
  otp?: string;
}

export interface IApiConfirmPasswordOtpRequest {
  email: string;
  otp: string;
}

export interface IApiConfirmPasswordOtpResponse {
  reset_token: string;
}

export interface IApiResetPasswordRequest {
  token: string;
  new_password: string;
}

export type TApiRequestOptions = RequestInit & {
  auth?: boolean;
  skipRefresh?: boolean;
};

// ─── Plans ───────────────────────────────────────────────────────────────────

export interface IApiPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: TApiPlanInterval;
  interval_days?: number;
  trial_days: number;
  features?: string[];
  archived_at?: string | null;
  created_at: string;
  active_subscriptions?: number;
}

export interface IApiPlanStats {
  active_subscriptions: number;
}

// ─── Customers ───────────────────────────────────────────────────────────────

export interface IApiCustomer {
  id: string;
  tenant_id?: string;
  email: string;
  name: string;
  phone?: string;
  external_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
  active_subscriptions?: number;
  total_paid?: number;
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export interface IApiSubscription {
  id: string;
  tenant_id?: string;
  customer_id: string;
  plan_id: string;
  payment_method_id?: string;
  fallback_payment_method_id?: string;
  state: string;
  mrr?: number;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  trial_end?: string | null;
  canceled_at?: string | null;
  pause_ends_at?: string | null;
  paused_until?: string | null;
  created_at: string;
  updated_at?: string;
  customer_name?: string;
  customer_email?: string;
  plan_name?: string;
  customer?: Partial<IApiCustomer> & { name?: string; email?: string };
  plan?: Partial<IApiPlan> & { name?: string };
  payment_method?: IApiPaymentMethod;
  fallback_payment_method?: IApiPaymentMethod;
}

export interface IApiSubscriptionTransition {
  id: string;
  from_state?: string | null;
  to_state: string;
  reason?: string;
  created_at: string;
}

// ─── Invoices ────────────────────────────────────────────────────────────────

export interface IApiInvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

/** Line item shape returned by the invoice detail endpoint (Go-style keys). */
export interface IApiInvoiceDetailLineItem {
  ID: string;
  InvoiceID?: string;
  TenantID?: string;
  Type?: string;
  Description: string;
  Amount: number;
  Currency?: string;
  PeriodStart?: string | null;
  PeriodEnd?: string | null;
  CreatedAt?: string;
}

/** Invoice detail endpoint wraps the invoice and its line items separately. */
export interface IApiInvoiceDetail {
  invoice: IApiInvoice;
  line_items?: IApiInvoiceDetailLineItem[];
}

export interface IApiInvoice {
  id: string;
  tenant_id?: string;
  subscription_id?: string;
  customer_id: string;
  status: string;
  amount_due: number;
  amount_due_display?: string;
  amount_paid: number;
  amount_paid_display?: string;
  currency: string;
  created_at: string;
  number?: string;
  customer_name?: string;
  customer_email?: string;
  due_date?: string;
  paid_at?: string | null;
  line_items?: IApiInvoiceLineItem[];
  customer?: IApiCustomer;
  subscription?: IApiSubscription;
  /** @deprecated Use amount_due instead */
  amount?: number;
}

// ─── Payment methods ─────────────────────────────────────────────────────────

export interface IApiPaymentMethod {
  id: string;
  tenant_id?: string;
  customer_id: string;
  type: string;
  card_brand?: string;
  card_last4?: string;
  /** Expiry formatted as "MM/YY" (e.g. "09/28"). */
  card_expiry?: string;
  /** Present for direct debit methods (e.g. "ready", "pending"). */
  mandate_status?: string;
  /** @deprecated Prefer card_expiry. */
  expiry_month?: number;
  /** @deprecated Prefer card_expiry. */
  expiry_year?: number;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

export interface IApiWebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret?: string;
  signing_secret?: string;
  last_delivery_status?: string;
  last_delivery_at?: string | null;
  created_at: string;
}

export interface IApiWebhookDelivery {
  id: string;
  endpoint_id: string;
  event_type: string;
  http_status: number;
  attempt: number;
  duration_ms?: number;
  duration?: number;
  request_body?: string;
  response_body?: string;
  created_at: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface IApiDunningStep {
  delay_days: number;
  action: string;
  email_template?: string;
  enabled?: boolean;
}

export interface IApiSettings {
  id?: string;
  name?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  brand_color?: string;
  billing_email_from_name?: string;
  dunning?: { steps?: IApiDunningStep[] };
  api_key?: string;
  api_key_masked?: string;
}

export interface IApiNombaSettings {
  account_id?: string;
  client_id?: string;
  client_secret?: string;
  sub_account_id?: string;
  env?: "sandbox" | "production";
  webhook_url?: string;
  webhook_secret?: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface IApiMrrAnalytics {
  mrr: number;
  currency: string;
  active_subscriptions: number;
}

export interface IApiRevenueAnalytics {
  total: number;
  currency: string;
  from: string;
  to: string;
  daily: Array<{ date: string; amount: number }>;
}

export interface IApiChurnAnalytics {
  churn_rate?: number;
  from?: string;
  to?: string;
}

export interface IApiDunningAnalytics {
  recovery_rate?: number;
  from?: string;
  to?: string;
}

// ─── Write requests ──────────────────────────────────────────────────────────

export interface IApiCheckoutRequest {
  customer_id: string;
  plan_id: string;
  success_url: string;
  cancel_url: string;
  send_checkout_email?: boolean;
}

export interface IApiCheckoutResponse {
  subscription_id: string;
  invoice_id?: string | null;
  checkout_url: string;
  order_reference: string;
  status: string;
}

export interface IApiPortalTokenRequest {
  subscription_id: string;
  expires_in_hours?: number;
}

export interface IApiPortalTokenResponse {
  token: string;
  expires_at?: string;
  url?: string;
}

export interface IApiCreatePlanRequest {
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: TApiPlanInterval;
  interval_days?: number;
  trial_days?: number;
  features?: string[];
}

export interface IApiCreateCustomerRequest {
  email: string;
  name: string;
  phone?: string;
  external_id?: string;
  metadata?: Record<string, unknown>;
}

export interface IApiCreateWebhookRequest {
  url: string;
  events: string[];
  is_active?: boolean;
}

export interface IApiRotateApiKeyResponse {
  api_key: string;
}

