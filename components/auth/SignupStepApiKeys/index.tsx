"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signupApiCredentialsSchema,
  type TSignupApiCredentialsValues,
} from "@/lib/auth/schemas";
import { useSignupStore } from "@/store/signup-store";
import type { ISignupStepApiKeysProps } from "./@types";

export function SignupStepApiKeys({ onNext, onBack }: ISignupStepApiKeysProps) {
  const { apiCredentials, setApiCredentials } = useSignupStore();
  const [showSecret, setShowSecret] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignupApiCredentialsValues>({
    resolver: zodResolver(signupApiCredentialsSchema),
    defaultValues: apiCredentials,
  });

  function onSubmit(values: TSignupApiCredentialsValues) {
    setApiCredentials(values);
    onNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Client ID & Client secret</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the API credentials from your Nomba developer dashboard.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/40 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          SubSync uses your client ID and client secret to authenticate with
          Nomba on your behalf — to create charges, manage subscriptions, and
          reconcile payments. Your keys are encrypted and never shared.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client-id">Client ID</Label>
          <Input
            id="client-id"
            placeholder="Enter client ID"
            autoComplete="off"
            aria-invalid={Boolean(errors.nomba_client_id)}
            {...register("nomba_client_id")}
          />
          {errors.nomba_client_id && (
            <p className="text-xs text-destructive">
              {errors.nomba_client_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="client-secret">Client secret</Label>
          <div className="relative">
            <Input
              id="client-secret"
              type={showSecret ? "text" : "password"}
              placeholder="Enter client secret"
              autoComplete="off"
              className="pr-10"
              aria-invalid={Boolean(errors.nomba_client_secret)}
              {...register("nomba_client_secret")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setShowSecret(!showSecret)}
              aria-label={showSecret ? "Hide secret" : "Show secret"}
            >
              {showSecret ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.nomba_client_secret && (
            <p className="text-xs text-destructive">
              {errors.nomba_client_secret.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
