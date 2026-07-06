"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OneTimeSecretDialog } from "@/components/dashboard/OneTimeSecretDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRotateApiKey,
  useSettings,
  useUpdateGeneralSettings,
  useUpdateNombaSettings,
} from "@/hooks/use-settings";
import { getErrorMessage } from "@/lib/api/auth";
import type {
  TGeneralSettingsValues,
  TNombaSettingsValues,
} from "@/lib/schemas/dashboard";

export function SettingsContent() {
  const { data: settings, isLoading } = useSettings();
  const updateGeneral = useUpdateGeneralSettings();
  const updateNomba = useUpdateNombaSettings();
  const rotateKey = useRotateApiKey();
  const [generalForm, setGeneralForm] = useState<TGeneralSettingsValues | null>(
    null
  );
  const [nombaForm, setNombaForm] = useState<TNombaSettingsValues | null>(null);
  const [rotatedKey, setRotatedKey] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setGeneralForm({
        name: settings.merchant.name,
        email: settings.merchant.email,
        website: settings.merchant.website ?? "",
      });
      setNombaForm({
        clientId: settings.nomba.clientId,
        clientSecret: settings.nomba.clientSecret,
        accountId: settings.nomba.accountId,
        subAccountId: settings.nomba.subAccountId,
        env: settings.nomba.env,
        webhookSecret: settings.webhookSecret,
      });
    }
  }, [settings]);

  if (isLoading || !settings || !generalForm || !nombaForm) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  const { apiKey, webhookUrl, dunningSteps } = settings;

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
            <Input
              value={generalForm.name}
              onChange={(e) =>
                setGeneralForm({ ...generalForm, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              value={generalForm.email}
              onChange={(e) =>
                setGeneralForm({ ...generalForm, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Website</Label>
            <Input
              value={generalForm.website ?? ""}
              onChange={(e) =>
                setGeneralForm({ ...generalForm, website: e.target.value })
              }
            />
          </div>
          <Button
            className="sm:col-span-2 sm:w-fit"
            disabled={updateGeneral.isPending}
            onClick={async () => {
              try {
                await updateGeneral.mutateAsync(generalForm);
                toast.success("Profile updated");
              } catch (error) {
                toast.error(getErrorMessage(error));
              }
            }}
          >
            {updateGeneral.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save profile
          </Button>
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
              <Input
                value={nombaForm.accountId}
                onChange={(e) =>
                  setNombaForm({ ...nombaForm, accountId: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Environment</Label>
              <select
                value={nombaForm.env}
                onChange={(e) =>
                  setNombaForm({
                    ...nombaForm,
                    env: e.target.value as TNombaSettingsValues["env"],
                  })
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="sandbox">Sandbox</option>
                <option value="production">Production</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Client ID</Label>
              <Input
                value={nombaForm.clientId}
                onChange={(e) =>
                  setNombaForm({ ...nombaForm, clientId: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Client secret</Label>
              <Input
                type="password"
                value={nombaForm.clientSecret}
                onChange={(e) =>
                  setNombaForm({ ...nombaForm, clientSecret: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Webhook secret</Label>
              <Input
                type="password"
                value={nombaForm.webhookSecret ?? ""}
                onChange={(e) =>
                  setNombaForm({ ...nombaForm, webhookSecret: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            variant="outline"
            disabled={updateNomba.isPending}
            onClick={async () => {
              try {
                await updateNomba.mutateAsync(nombaForm);
                toast.success("Nomba settings saved");
              } catch (error) {
                toast.error(getErrorMessage(error));
              }
            }}
          >
            {updateNomba.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save Nomba settings
          </Button>
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
              try {
                const key = await rotateKey.mutateAsync();
                setRotatedKey(key);
              } catch (error) {
                toast.error(getErrorMessage(error));
              }
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
          <CardTitle className="text-base font-medium">Inbound webhooks</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Nomba webhook URL (paste into Nomba dashboard)</Label>
            <Input value={webhookUrl} readOnly className="font-mono text-xs" />
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

      <OneTimeSecretDialog
        open={Boolean(rotatedKey)}
        onOpenChange={(open) => !open && setRotatedKey(null)}
        title="New API key"
        description="Copy this key now. You won't be able to see it again."
        secret={rotatedKey ?? ""}
        label="API key"
      />
    </div>
  );
}
