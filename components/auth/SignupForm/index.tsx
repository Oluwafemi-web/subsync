"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signupAction } from "@/app/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupProgress } from "@/components/auth/SignupProgress";
import { SignupStepAccount } from "@/components/auth/SignupStepAccount";
import { SignupStepApiKeys } from "@/components/auth/SignupStepApiKeys";
import { SignupStepNombaAccount } from "@/components/auth/SignupStepNombaAccount";
import type { TSignupPayload, TSignupNombaAccountValues } from "@/lib/auth/schemas";
import { buildSignupPayload } from "@/lib/auth/signup-payload";
import { useSignupStore } from "@/store/signup-store";
import type { ISignupFormProps } from "./@types";

export function SignupForm({ redirectTo = "/dashboard" }: ISignupFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    step,
    account,
    apiCredentials,
    nextStep,
    prevStep,
    setNombaAccount,
  } = useSignupStore();

  async function handleFinalSubmit(nombaAccount: TSignupNombaAccountValues) {
    setIsSubmitting(true);
    setNombaAccount(nombaAccount);

    const values = buildSignupPayload({
      ...account,
      ...apiCredentials,
      ...nombaAccount,
    });

    const result = await signupAction(values, redirectTo);

    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <Card className="border-0 shadow-none ring-0 lg:border lg:shadow-sm lg:ring-1">
      <CardHeader className="px-0 lg:px-6">
        <CardTitle className="sr-only">Create account</CardTitle>
        <CardDescription className="sr-only">
          Register your merchant account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0 lg:px-6">
        <SignupProgress step={step} />
        {step === 1 && <SignupStepAccount onNext={nextStep} />}
        {step === 2 && (
          <SignupStepApiKeys onNext={nextStep} onBack={prevStep} />
        )}
        {step === 3 && (
          <SignupStepNombaAccount
            onBack={prevStep}
            isSubmitting={isSubmitting}
            onSubmit={handleFinalSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
}
