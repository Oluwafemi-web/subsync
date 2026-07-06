"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword, getErrorMessage } from "@/lib/api/auth";
import {
  forgotPasswordEmailSchema,
  type TForgotPasswordEmailValues,
} from "@/lib/auth/schemas";
import { useForgotPasswordStore } from "@/store/forgot-password-store";
import type { IForgotPasswordStepEmailProps } from "./@types";

export function ForgotPasswordStepEmail({
  onNext,
}: IForgotPasswordStepEmailProps) {
  const { email, setEmail, setDevOtp } = useForgotPasswordStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TForgotPasswordEmailValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: email,
  });

  async function onSubmit(values: TForgotPasswordEmailValues) {
    setIsSubmitting(true);
    setEmail(values);

    try {
      const result = await forgotPassword(values);
      setDevOtp(result.otp ?? null);
      toast.success("If an account exists, a verification code has been sent.");
      onNext();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to send verification code"));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter the email address for your account. We&apos;ll send a
          verification code to reset your password.
        </p>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.ng"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending code..." : "Send verification code"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
