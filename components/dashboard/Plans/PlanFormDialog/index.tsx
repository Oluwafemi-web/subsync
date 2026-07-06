"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
import { useCreatePlan, useUpdatePlan } from "@/hooks/use-plans";
import { getErrorMessage } from "@/lib/api/auth";
import { planFormSchema, type TPlanFormValues } from "@/lib/schemas/dashboard";
import type { IPlanFormDialogProps } from "./@types";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function planToFormValues(plan: IPlanFormDialogProps["plan"]): TPlanFormValues {
  return {
    name: plan?.name ?? "",
    description: plan?.description ?? "",
    price: plan?.price ?? 0,
    interval:
      plan?.interval === "year"
        ? "year"
        : plan?.interval === "custom"
          ? "custom"
          : "month",
    customIntervalDays: plan?.customIntervalDays,
    trialDays: plan?.trialDays ?? 0,
    features: plan?.features.join("\n") ?? "",
  };
}

export function PlanFormDialog({
  open,
  onOpenChange,
  mode,
  plan,
  onSuccess,
}: IPlanFormDialogProps) {
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan(plan?.id ?? "");
  const isPending = createPlan.isPending || updatePlan.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TPlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: planToFormValues(plan),
  });

  const interval = watch("interval");

  useEffect(() => {
    if (open) {
      reset(planToFormValues(plan));
    }
  }, [open, plan, reset]);

  async function onSubmit(values: TPlanFormValues) {
    const payload = {
      name: values.name,
      description: values.description,
      price: values.price,
      interval: values.interval,
      customIntervalDays: values.customIntervalDays,
      trialDays: values.trialDays,
      features: values.features
        ? values.features.split("\n").map((f) => f.trim()).filter(Boolean)
        : [],
    };

    try {
      if (mode === "create") {
        await createPlan.mutateAsync(payload);
        toast.success("Plan created");
      } else if (plan) {
        await updatePlan.mutateAsync(payload);
        toast.success("Plan updated");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save plan"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New plan" : "Edit plan"}
          </DialogTitle>
          <DialogDescription>
            Prices are in naira. Billing interval and trial apply to new
            subscriptions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="trialDays">Trial days</Label>
              <Input
                id="trialDays"
                type="number"
                {...register("trialDays", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval">Interval</Label>
            <select id="interval" className={selectClassName} {...register("interval")}>
              <option value="month">Monthly</option>
              <option value="year">Annual</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {interval === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customIntervalDays">Custom interval (days)</Label>
              <Input
                id="customIntervalDays"
                type="number"
                {...register("customIntervalDays", { valueAsNumber: true })}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="features">Features (one per line)</Label>
            <textarea
              id="features"
              className="min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("features")}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create plan" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
