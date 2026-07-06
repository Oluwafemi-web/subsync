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
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/use-customers";
import { getErrorMessage } from "@/lib/api/auth";
import {
  customerFormSchema,
  type TCustomerFormValues,
} from "@/lib/schemas/dashboard";
import type { ICustomerFormDialogProps } from "./@types";

export function CustomerFormDialog({
  open,
  onOpenChange,
  mode,
  customerId,
  defaultValues,
  onSuccess,
}: ICustomerFormDialogProps) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer(customerId ?? "");
  const isPending = createCustomer.isPending || updateCustomer.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      externalId: defaultValues?.externalId ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? "",
        email: defaultValues?.email ?? "",
        phone: defaultValues?.phone ?? "",
        externalId: defaultValues?.externalId ?? "",
      });
    }
  }, [open, defaultValues, reset]);

  async function onSubmit(values: TCustomerFormValues) {
    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      externalId: values.externalId,
    };

    try {
      if (mode === "create") {
        await createCustomer.mutateAsync(payload);
        toast.success("Customer created");
      } else if (customerId) {
        await updateCustomer.mutateAsync(payload);
        toast.success("Customer updated");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save customer"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add customer" : "Edit customer"}
          </DialogTitle>
          <DialogDescription>
            Customer details are used for billing and checkout emails.
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="externalId">External ID (optional)</Label>
            <Input id="externalId" {...register("externalId")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "create" ? "Add customer" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
