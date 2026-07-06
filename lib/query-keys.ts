import type { IAnalyticsDateRange } from "@/types";

export const queryKeys = {
  overview: {
    metrics: (range?: IAnalyticsDateRange) =>
      ["overview", "metrics", range] as const,
    revenue: (range?: IAnalyticsDateRange) =>
      ["overview", "revenue", range] as const,
    breakdown: ["overview", "breakdown"] as const,
    activity: ["overview", "activity"] as const,
  },
  notifications: ["notifications"] as const,
  plans: {
    all: ["plans"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["plans", "list", filters] as const,
    detail: (id: string) => ["plans", id] as const,
    stats: (id: string) => ["plans", id, "stats"] as const,
  },
  subscriptions: {
    list: (filters?: Record<string, unknown>) =>
      ["subscriptions", filters] as const,
    detail: (id: string) => ["subscriptions", id] as const,
    transitions: (id: string) => ["subscriptions", id, "transitions"] as const,
  },
  customers: {
    list: (filters?: Record<string, unknown>) =>
      ["customers", "list", filters] as const,
    detail: (id: string) => ["customers", id] as const,
    stats: (id: string) => ["customers", id, "stats"] as const,
    paymentMethods: (id: string) =>
      ["customers", id, "payment-methods"] as const,
  },
  invoices: {
    list: (filters?: Record<string, unknown>) =>
      ["invoices", filters] as const,
    detail: (id: string) => ["invoices", id] as const,
  },
  webhooks: {
    all: ["webhooks"] as const,
    detail: (id: string) => ["webhooks", id] as const,
    deliveries: (id: string) => ["webhooks", id, "deliveries"] as const,
  },
  settings: ["settings"] as const,
} as const;
