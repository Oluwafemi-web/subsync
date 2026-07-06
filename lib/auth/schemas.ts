import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const nombaEnvSchema = z.enum(["sandbox", "production"], {
  message: "Select a Nomba environment",
});

export const signupAccountSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Business name is required"),
});

export const signupApiCredentialsSchema = z.object({
  nomba_client_id: z.string().min(1, "Client ID is required"),
  nomba_client_secret: z.string().min(1, "Client secret is required"),
});

export const signupNombaAccountSchema = z.object({
  nomba_account_id: z.string().min(1, "Account ID is required"),
  nomba_sub_account_id: z.string().optional(),
  nomba_env: nombaEnvSchema,
  nomba_webhook_secret: z.string().optional(),
});

export const signupSchema = signupAccountSchema
  .merge(signupApiCredentialsSchema)
  .merge(signupNombaAccountSchema);

export const businessDetailsSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  email: z.string().email("Enter a valid email address"),
  website: z
    .union([
      z.string().url("Enter a valid URL (include https://)"),
      z.literal(""),
    ])
    .optional(),
});

export const nombaApiCredentialsSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client secret is required"),
});

export const nombaAccountDetailsSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  subAccountId: z.string().optional(),
  env: nombaEnvSchema,
});

export const nombaCredentialsSchema = nombaApiCredentialsSchema.merge(
  nombaAccountDetailsSchema
);

export type TNombaEnv = z.infer<typeof nombaEnvSchema>;
export type TLoginFormValues = z.infer<typeof loginSchema>;
export type TSignupPayload = z.infer<typeof signupSchema>;
export type TSignupFormValues = TSignupPayload;
export type TSignupAccountValues = z.infer<typeof signupAccountSchema>;
export type TSignupApiCredentialsValues = z.infer<
  typeof signupApiCredentialsSchema
>;
export type TSignupNombaAccountValues = z.infer<
  typeof signupNombaAccountSchema
>;
export type TBusinessDetailsValues = z.infer<typeof businessDetailsSchema>;
export type TNombaCredentialsValues = z.infer<typeof nombaCredentialsSchema>;
