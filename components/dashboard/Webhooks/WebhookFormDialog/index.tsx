"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { useCreateWebhook } from "@/hooks/use-webhooks";
import { getErrorMessage } from "@/lib/api/auth";
import {
  webhookFormSchema,
  type TWebhookFormValues,
} from "@/lib/schemas/dashboard";
import type { IWebhookFormDialogProps } from "./@types";

export function WebhookFormDialog({
  open,
  onOpenChange,
}: IWebhookFormDialogProps) {
  const createWebhook = useCreateWebhook();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TWebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      url: "",
      events: "subscription.updated, invoice.paid",
      isActive: true,
    },
  });

  async function onSubmit(values: TWebhookFormValues) {
    const events = values.events
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    try {
      await createWebhook.mutateAsync({
        url: values.url,
        events,
        isActive: values.isActive,
      });
      toast.success("Webhook endpoint created");
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create webhook"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add webhook endpoint</DialogTitle>
          <DialogDescription>
            Receive SubSync events at your server. Use * for all events.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Endpoint URL</Label>
            <Input
              id="url"
              placeholder="https://yourapp.com/webhooks"
              {...register("url")}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="events">Events (comma-separated)</Label>
            <Input
              id="events"
              placeholder="subscription.updated, invoice.paid"
              {...register("events")}
            />
            {errors.events && (
              <p className="text-xs text-destructive">{errors.events.message}</p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isActive")} />
            Active
          </label>
          <DialogFooter>
            <Button type="submit" disabled={createWebhook.isPending}>
              {createWebhook.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create endpoint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
