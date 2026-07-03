"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signupAccountSchema,
  type TSignupAccountValues,
} from "@/lib/auth/schemas";
import { useSignupStore } from "@/store/signup-store";
import type { ISignupStepAccountProps } from "./@types";

export function SignupStepAccount({ onNext }: ISignupStepAccountProps) {
  const { account, setAccount } = useSignupStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignupAccountValues>({
    resolver: zodResolver(signupAccountSchema),
    defaultValues: account,
  });

  function onSubmit(values: TSignupAccountValues) {
    setAccount(values);
    onNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Business name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Acme Ltd"
            autoComplete="organization"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button type="submit" className="w-full">
          Continue
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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
