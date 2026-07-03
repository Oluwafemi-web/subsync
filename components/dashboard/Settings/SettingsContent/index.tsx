"use client";

import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRotateApiKey,
  useSettings,
  useVerifyNombaCredentials,
} from "@/hooks/use-settings";

export function SettingsContent() {
  const { data: settings, isLoading } = useSettings();
  const verifyCredentials = useVerifyNombaCredentials();
  const rotateKey = useRotateApiKey();
  const [verified, setVerified] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!settings) return null;

  const { merchant, nomba, apiKey, webhookUrl, webhookSecret, dunningSteps } =
    settings;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your merchant profile and integrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Merchant profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Business name</Label>
            <Input value={merchant.name} readOnly />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={merchant.email} readOnly />
          </div>
          <div className="space-y-1.5">
            <Label>Website</Label>
            <Input value={merchant.website ?? ""} readOnly />
          </div>
          <div className="space-y-1.5">
            <Label>Billing email</Label>
            <Input value={merchant.billingEmail ?? ""} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Nomba credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Account ID</Label>
              <Input value={nomba.accountId} readOnly />
            </div>
            <div className="space-y-1.5">
              <Label>Environment</Label>
              <Input value={nomba.env} readOnly className="capitalize" />
            </div>
            <div className="space-y-1.5">
              <Label>Client ID</Label>
              <Input value={nomba.clientId} readOnly />
            </div>
            <div className="space-y-1.5">
              <Label>Client secret</Label>
              <Input value={nomba.clientSecret} readOnly type="password" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={verifyCredentials.isPending}
              onClick={async () => {
                const result = await verifyCredentials.mutateAsync({
                  accountId: nomba.accountId,
                  clientId: nomba.clientId,
                  clientSecret: nomba.clientSecret,
                });
                if (result.success) {
                  setVerified(true);
                  toast.success("Nomba credentials verified");
                } else {
                  toast.error(result.error ?? "Verification failed");
                }
              }}
            >
              {verifyCredentials.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify credentials"
              )}
            </Button>
            {verified && (
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Verified
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">API key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Live API key</Label>
            <Input value={apiKey} readOnly className="font-mono text-xs" />
          </div>
          <Button
            variant="outline"
            disabled={rotateKey.isPending}
            onClick={async () => {
              await rotateKey.mutateAsync();
              toast.success("API key rotated");
            }}
          >
            {rotateKey.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Rotate key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Webhooks</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Webhook URL</Label>
            <Input value={webhookUrl} readOnly className="font-mono text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label>Webhook secret</Label>
            <Input
              value={webhookSecret}
              readOnly
              type="password"
              className="font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Dunning steps</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Day</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Template</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {dunningSteps.map((step) => (
                <tr key={step.id}>
                  <td className="px-4 py-3">Day {step.day}</td>
                  <td className="px-4 py-3">{step.action}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {step.emailTemplate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        step.enabled
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      {step.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
