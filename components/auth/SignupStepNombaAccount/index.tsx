"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  signupNombaAccountSchema,
  type TSignupNombaAccountValues,
} from "@/lib/auth/schemas";
import { useSignupStore } from "@/store/signup-store";
import type { ISignupStepNombaAccountProps } from "./@types";

const selectClassName = cn(
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
);

export function SignupStepNombaAccount({
  onBack,
  onSubmit,
  isSubmitting,
}: ISignupStepNombaAccountProps) {
  const { nombaAccount, setNombaAccount } = useSignupStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignupNombaAccountValues>({
    resolver: zodResolver(signupNombaAccountSchema),
    defaultValues: nombaAccount,
  });

  function handleFormSubmit(values: TSignupNombaAccountValues) {
    setNombaAccount(values);
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="rounded-lg border bg-muted/40 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Your Account ID identifies the Nomba merchant account where subscription
          payments should be settled. If you split revenue across sub-accounts,
          provide that ID too. The webhook secret lets SubSync verify payment
          events from Nomba. Choose sandbox while testing, or production when
          you&apos;re ready to charge real customers.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nomba_account_id">Account ID</Label>
          <Input
            id="nomba_account_id"
            placeholder="f666ef9b-888e-4799-85ce-acb505b28023"
            autoComplete="off"
            aria-invalid={Boolean(errors.nomba_account_id)}
            {...register("nomba_account_id")}
          />
          {errors.nomba_account_id && (
            <p className="text-xs text-destructive">
              {errors.nomba_account_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nomba_sub_account_id">
            Sub-account ID{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="nomba_sub_account_id"
            placeholder="f356c7cc-c9aa-417b-99d9-9b0e1a2f8080"
            autoComplete="off"
            {...register("nomba_sub_account_id")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nomba_env">Nomba environment</Label>
          <select
            id="nomba_env"
            className={selectClassName}
            aria-invalid={Boolean(errors.nomba_env)}
            {...register("nomba_env")}
          >
            <option value="sandbox">Sandbox (testing)</option>
            <option value="production">Production (live payments)</option>
          </select>
          {errors.nomba_env && (
            <p className="text-xs text-destructive">{errors.nomba_env.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nomba_webhook_secret">
            Webhook secret{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="nomba_webhook_secret"
            type="password"
            placeholder="Configure later in Settings"
            autoComplete="off"
            {...register("nomba_webhook_secret")}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </div>
    </form>
  );
}
