"use client";

import { useEffect, useState } from "react";
import { OneTimeSecretDialog } from "@/components/dashboard/OneTimeSecretDialog";
import { consumePendingNombaWebhookUrl } from "@/lib/auth/pending-secrets";

export function PendingNombaWebhookPrompt() {
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  useEffect(() => {
    setWebhookUrl(consumePendingNombaWebhookUrl());
  }, []);

  return (
    <OneTimeSecretDialog
      open={Boolean(webhookUrl)}
      onOpenChange={(open) => {
        if (!open) {
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
