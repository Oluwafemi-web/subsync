"use client";

import { useEffect, useState } from "react";
import { OneTimeSecretDialog } from "@/components/dashboard/OneTimeSecretDialog";
import {
  consumePendingNombaWebhookUrl,
  hasSeenNombaWebhookPrompt,
  markNombaWebhookPromptSeen,
} from "@/lib/auth/pending-secrets";
import { useAuthStore } from "@/store/auth-store";

export function PendingNombaWebhookPrompt() {
  const userId = useAuthStore((state) => state.user?.id);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || hasSeenNombaWebhookPrompt(userId)) {
      return;
    }

    setWebhookUrl(consumePendingNombaWebhookUrl());
  }, [userId]);

  return (
    <OneTimeSecretDialog
      open={Boolean(webhookUrl)}
      onOpenChange={(open) => {
        if (!open) {
          if (userId) {
            markNombaWebhookPromptSeen(userId);
          }
          setWebhookUrl(null);
        }
      }}
      title="Configure your Nomba webhook"
      description="Copy this webhook URL and paste it into your Nomba dashboard so SubSync can receive payment updates on your behalf. You can also find this URL later in Settings under Inbound webhooks."
      secret={webhookUrl ?? ""}
      label="Nomba webhook URL"
      confirmLabel="Done"
    />
  );
}
