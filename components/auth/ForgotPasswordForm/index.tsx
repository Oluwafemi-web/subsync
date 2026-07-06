"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordProgress } from "@/components/auth/ForgotPasswordProgress";
import { ForgotPasswordStepEmail } from "@/components/auth/ForgotPasswordStepEmail";
import { ForgotPasswordStepOtp } from "@/components/auth/ForgotPasswordStepOtp";
import { ForgotPasswordStepReset } from "@/components/auth/ForgotPasswordStepReset";
import { useForgotPasswordStore } from "@/store/forgot-password-store";
import type { IForgotPasswordFormProps } from "./@types";

export function ForgotPasswordForm(_props: IForgotPasswordFormProps) {
  const { step, nextStep, prevStep } = useForgotPasswordStore();

  return (
    <Card className="border-0 shadow-none ring-0 lg:border lg:shadow-sm lg:ring-1">
      <CardHeader className="px-0 lg:px-6">
        <CardTitle className="sr-only">Reset password</CardTitle>
        <CardDescription className="sr-only">
          Reset your account password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0 lg:px-6">
        <ForgotPasswordProgress step={step} />
        {step === 1 && <ForgotPasswordStepEmail onNext={nextStep} />}
        {step === 2 && (
          <ForgotPasswordStepOtp onNext={nextStep} onBack={prevStep} />
        )}
        {step === 3 && <ForgotPasswordStepReset onBack={prevStep} />}
      </CardContent>
    </Card>
  );
}
