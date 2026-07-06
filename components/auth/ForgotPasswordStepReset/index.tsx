"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage, resetPassword } from "@/lib/api/auth";
import {
  resetPasswordSchema,
  type TResetPasswordValues,
} from "@/lib/auth/schemas";
import { useForgotPasswordStore } from "@/store/forgot-password-store";
import type { IForgotPasswordStepResetProps } from "./@types";

export function ForgotPasswordStepReset({
  onBack,
}: IForgotPasswordStepResetProps) {
  const router = useRouter();
  const { resetToken, reset: resetStore } = useForgotPasswordStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: TResetPasswordValues) {
    if (!resetToken) {
      toast.error("Session expired. Please start over.");
      router.push("/forgot-password");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(resetToken, values);
      resetStore();
      toast.success("Password updated. You can sign in now.");
      router.push("/login");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to reset password"));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Choose a new password for your account.
        </p>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating password..." : "Update password"}
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
