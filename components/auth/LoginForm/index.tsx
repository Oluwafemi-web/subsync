"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { establishAuthSessionAction } from "@/app/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage, login } from "@/lib/api/auth";
import { loginSchema, type TLoginFormValues } from "@/lib/auth/schemas";
import { useAuthStore } from "@/store/auth-store";
import type { ILoginFormProps } from "./@types";

export function LoginForm({ redirectTo = "/dashboard" }: ILoginFormProps) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: TLoginFormValues) {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await login(values);
      setSession(result.session);
      await establishAuthSessionAction();
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(error, "Unable to sign in");
      setAuthError(message);
      if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("unauthorized")) {
        setAuthError("Invalid credentials");
      } else {
        toast.error(message);
      }
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-0 shadow-none ring-0 lg:border lg:shadow-sm lg:ring-1">
      <CardHeader className="px-0 lg:px-6">
        <CardTitle className="sr-only">Sign in</CardTitle>
        <CardDescription className="sr-only">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 px-0 lg:px-6">
          {authError === "Invalid credentials" && (
            <Alert variant="destructive">
              <AlertDescription>Invalid credentials</AlertDescription>
            </Alert>
          )}
          {authError && authError !== "Invalid credentials" && (
            <Alert variant="destructive">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-0 bg-transparent px-0 pt-2 lg:px-6">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
