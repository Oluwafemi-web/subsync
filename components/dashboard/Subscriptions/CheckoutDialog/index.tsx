"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/use-customers";
import { usePlans } from "@/hooks/use-plans";
import { useStartCheckout } from "@/hooks/use-subscriptions";
import { getErrorMessage } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { copyToClipboard, getCheckoutRedirectUrls } from "@/lib/checkout";
import {
  checkoutFormSchema,
  type TCheckoutFormValues,
} from "@/lib/schemas/dashboard";
import type { ICheckoutDialogProps, ICheckoutSuccessState } from "./@types";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CheckoutDialog({
  open,
  onOpenChange,
  onSuccess,
}: ICheckoutDialogProps) {
  const [result, setResult] = useState<ICheckoutSuccessState | null>(null);
  const { data: customersData } = useCustomers({ pageSize: 100 });
  const { data: plansData } = usePlans({ pageSize: 100 });
  const startCheckout = useStartCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerId: "",
      planId: "",
      sendCheckoutEmail: true,
    },
  });

  const customers = customersData?.data ?? [];
  const plans = plansData?.data ?? [];

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setResult(null);
    }
    onOpenChange(nextOpen);
  }

  async function onSubmit(values: TCheckoutFormValues) {
    const urls = getCheckoutRedirectUrls();
    const customer = customers.find((c) => c.id === values.customerId);

    try {
      const checkout = await startCheckout.mutateAsync({
        customerId: values.customerId,
        planId: values.planId,
        successUrl: urls.successUrl,
        cancelUrl: urls.cancelUrl,
        sendCheckoutEmail: values.sendCheckoutEmail,
      });

      setResult({
        checkoutUrl: checkout.checkoutUrl,
        subscriptionId: checkout.subscriptionId,
        customerEmail: customer?.email,
      });
      onSuccess?.();
    } catch (error) {
      if (error instanceof ApiError && error.code === "conflict") {
        toast.error(
          "Customer already has a pending checkout for this plan. Resume from subscription detail."
        );
        return;
      }
      toast.error(getErrorMessage(error, "Unable to start checkout"));
    }
  }

  async function handleCopy() {
    if (!result?.checkoutUrl) return;
    await copyToClipboard(result.checkoutUrl);
    toast.success("Checkout link copied");
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {result ? "Checkout link ready" : "New subscription"}
          </DialogTitle>
          <DialogDescription>
            {result
              ? valuesDescription(result)
              : "Create a subscription and send the customer a Nomba checkout link."}
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Checkout URL</Label>
              <div className="flex gap-2">
                <Input
                  value={result.checkoutUrl}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => handleClose(false)}>
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <select
                id="customerId"
                className={selectClassName}
                {...register("customerId")}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-xs text-destructive">
                  {errors.customerId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="planId">Plan</Label>
              <select
                id="planId"
                className={selectClassName}
                {...register("planId")}
              >
                <option value="">Select plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              {errors.planId && (
                <p className="text-xs text-destructive">{errors.planId.message}</p>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("sendCheckoutEmail")} />
              Email checkout link to customer
            </label>
            <DialogFooter>
              <Button type="submit" disabled={startCheckout.isPending}>
                {startCheckout.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Start checkout
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function valuesDescription(result: ICheckoutSuccessState): string {
  if (result.customerEmail) {
    return `Checkout link sent to ${result.customerEmail}. You can also copy the link below.`;
  }
  return "Share this link with your customer to complete payment.";
}
