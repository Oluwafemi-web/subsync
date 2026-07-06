import { z } from "zod";

export const planFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  interval: z.enum(["month", "year", "custom"]),
  customIntervalDays: z.number().positive().optional(),
  trialDays: z.number().min(0),
  features: z.string().optional(),
});

export const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  externalId: z.string().optional(),
});

export const checkoutFormSchema = z.object({
  customerId: z.string().min(1, "Select a customer"),
  planId: z.string().min(1, "Select a plan"),
  sendCheckoutEmail: z.boolean(),
});

export const cancelSubscriptionSchema = z.object({
  cancelAtPeriodEnd: z.boolean().default(true),
  reason: z.string().optional(),
});

export const pauseSubscriptionSchema = z.object({
  pauseEndsAt: z.string().optional(),
});

export const upgradeSubscriptionSchema = z.object({
  newPlanId: z.string().min(1, "Select a plan"),
});

export const webhookFormSchema = z.object({
  url: z.string().url("Enter a valid HTTPS URL"),
  events: z.string().min(1, "Enter at least one event"),
  isActive: z.boolean(),
});

export const generalSettingsSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  email: z.string().email("Enter a valid email"),
  website: z.union([z.string().url(), z.literal("")]).optional(),
});

export const nombaSettingsSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client secret is required"),
  accountId: z.string().min(1, "Account ID is required"),
  subAccountId: z.string().optional(),
  env: z.enum(["sandbox", "production"]),
  webhookSecret: z.string().optional(),
});

export type TPlanFormValues = z.infer<typeof planFormSchema>;
export type TCustomerFormValues = z.infer<typeof customerFormSchema>;
export type TCheckoutFormValues = z.infer<typeof checkoutFormSchema>;
export type TCancelSubscriptionValues = z.infer<typeof cancelSubscriptionSchema>;
export type TPauseSubscriptionValues = z.infer<typeof pauseSubscriptionSchema>;
export type TUpgradeSubscriptionValues = z.infer<typeof upgradeSubscriptionSchema>;
export type TWebhookFormValues = z.infer<typeof webhookFormSchema>;
export type TGeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
export type TNombaSettingsValues = z.infer<typeof nombaSettingsSchema>;
