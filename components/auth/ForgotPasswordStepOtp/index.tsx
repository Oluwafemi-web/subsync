"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmPasswordOtp, getErrorMessage } from "@/lib/api/auth";
import {
  forgotPasswordOtpSchema,
  type TForgotPasswordOtpValues,
} from "@/lib/auth/schemas";
import { useForgotPasswordStore } from "@/store/forgot-password-store";
import type { IForgotPasswordStepOtpProps } from "./@types";

export function ForgotPasswordStepOtp({
  onNext,
  onBack,
}: IForgotPasswordStepOtpProps) {
  const { email, otp, devOtp, setOtp, setResetToken } = useForgotPasswordStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TForgotPasswordOtpValues>({
    resolver: zodResolver(forgotPasswordOtpSchema),
    defaultValues: otp,
  });

  async function onSubmit(values: TForgotPasswordOtpValues) {
    setIsSubmitting(true);
    setOtp(values);

    try {
      const resetToken = await confirmPasswordOtp(email.email, values);
      setResetToken(resetToken);
      onNext();
    } catch (error) {
      toast.error(getErrorMessage(error, "Invalid verification code"));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter the verification code sent to{" "}
          <span className="font-medium text-foreground">{email.email}</span>.
        </p>

        {devOtp && (
          <Alert>
            <AlertDescription>
              Development mode: your verification code is{" "}
              <span className="font-mono font-semibold">{devOtp}</span>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            aria-invalid={Boolean(errors.otp)}
            {...register("otp")}
          />
          {errors.otp && (
            <p className="text-xs text-destructive">{errors.otp.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify code"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
      </div>
    </form>
  );
}
