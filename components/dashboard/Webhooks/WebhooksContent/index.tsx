"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { WebhookFormDialog } from "@/components/dashboard/Webhooks/WebhookFormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteWebhook, useWebhookDeliveries, useWebhooks } from "@/hooks/use-webhooks";
import { getErrorMessage } from "@/lib/api/auth";
import { formatDateTime, formatRelativeOrAbsolute } from "@/lib/format";
import {
  getWebhookDeliveryLabel,
  getWebhookDeliveryStyle,
} from "@/lib/status";
import type { IWebhookEndpoint } from "@/types";

function WebhookDeliveries({ endpointId }: { endpointId: string }) {
  const { data: deliveries, isLoading } = useWebhookDeliveries(endpointId);

  if (isLoading) {
    return (
      <div className="space-y-2 border-t px-4 py-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
    );
  }

  if (!deliveries?.length) {
    return (
      <p className="border-t px-4 py-3 text-xs text-muted-foreground">
        No recent deliveries
      </p>
    );
  }

  return (
    <div className="divide-y border-t">
      {deliveries.map((delivery) => (
        <div
          key={delivery.id}
          className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
        >
          <div className="min-w-0">
            <p className="font-medium">{delivery.eventType}</p>
            <p className="text-xs text-muted-foreground">
              HTTP {delivery.httpStatus} · Attempt {delivery.attempt} ·{" "}
              {delivery.duration}ms
            </p>
          </div>
          <time className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeOrAbsolute(delivery.createdAt)}
          </time>
        </div>
      ))}
    </div>
  );
}

function WebhookCard({
  webhook,
  isExpanded,
  onToggle,
  onDelete,
}: {
  webhook: IWebhookEndpoint;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base font-medium">
              {webhook.url}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {webhook.events.join(", ")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <StatusBadge
              label={webhook.active ? "Active" : "Inactive"}
              className={
                webhook.active
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }
            />
            <StatusBadge
              label={getWebhookDeliveryLabel(webhook.lastDeliveryStatus)}
              className={getWebhookDeliveryStyle(webhook.lastDeliveryStatus)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-0 p-0 pb-0">
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <span>Secret: {webhook.secret}</span>
          {webhook.lastDeliveryAt && (
            <span>
              Last delivery {formatDateTime(webhook.lastDeliveryAt)}
            </span>
          )}
        </div>
        {isExpanded && <WebhookDeliveries endpointId={webhook.id} />}
      </CardContent>
    </Card>
  );
}

export function WebhooksContent() {
  const { data: webhooks, isLoading } = useWebhooks();
  const deleteWebhook = useDeleteWebhook();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Webhooks</h1>
          <p className="text-sm text-muted-foreground">
            Manage webhook endpoints and delivery logs
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add endpoint
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks?.map((webhook) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              isExpanded={expandedId === webhook.id}
              onToggle={() =>
                setExpandedId(expandedId === webhook.id ? null : webhook.id)
              }
              onDelete={async () => {
                try {
                  await deleteWebhook.mutateAsync(webhook.id);
                  toast.success("Webhook deleted");
                } catch (error) {
                  toast.error(getErrorMessage(error));
                }
              }}
            />
          ))}
        </div>
      )}

      <WebhookFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
