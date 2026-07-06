"use client";

import { Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildPortalUrl,
  useCancelSubscription,
  useCreatePortalToken,
  usePauseSubscription,
  useResumeCheckout,
  useResumeSubscription,
  useUpgradeSubscription,
} from "@/hooks/use-subscriptions";
import { usePlans } from "@/hooks/use-plans";
import { getErrorMessage } from "@/lib/api/auth";
import { copyToClipboard, getCheckoutRedirectUrls } from "@/lib/checkout";
import type { ISubscriptionActionsProps } from "./@types";

export function SubscriptionActions({ subscription }: ISubscriptionActionsProps) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [upgradePlanId, setUpgradePlanId] = useState("");
  const cancel = useCancelSubscription(subscription.id);
  const pause = usePauseSubscription(subscription.id);
  const resume = useResumeSubscription(subscription.id);
  const resumeCheckout = useResumeCheckout(subscription.id);
  const portalToken = useCreatePortalToken(subscription.id);
  const upgrade = useUpgradeSubscription(subscription.id);
  const { data: plansData } = usePlans({ pageSize: 100 });
  const plans = plansData?.data ?? [];

  const canResendCheckout = subscription.state === "incomplete";
  const canCancel = ["active", "trialing", "past_due", "paused"].includes(
    subscription.state
  );
  const canPause = ["active", "trialing"].includes(subscription.state);
  const canResume = subscription.state === "paused";

  async function handleResendCheckout() {
    const urls = getCheckoutRedirectUrls();
    try {
      const result = await resumeCheckout.mutateAsync({
        customerId: subscription.customerId,
        planId: subscription.planId,
        successUrl: urls.successUrl,
        cancelUrl: urls.cancelUrl,
        sendCheckoutEmail: true,
      });
      setCheckoutUrl(result.checkoutUrl);
      toast.success("Checkout link sent");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to resend checkout link"));
    }
  }

  async function handlePortalLink() {
    try {
      const result = await portalToken.mutateAsync();
      const url = buildPortalUrl(result.token);
      setPortalUrl(url);
      await copyToClipboard(url);
      toast.success("Portal link copied to clipboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create portal link"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {canResendCheckout && (
          <Button
            variant="outline"
            size="sm"
            disabled={resumeCheckout.isPending}
            onClick={handleResendCheckout}
          >
            {resumeCheckout.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Resend payment link
          </Button>
        )}
        {canPause && (
          <Button
            variant="outline"
            size="sm"
            disabled={pause.isPending}
            onClick={() => pause.mutate(undefined, {
              onSuccess: () => toast.success("Subscription paused"),
              onError: (e) => toast.error(getErrorMessage(e)),
            })}
          >
            Pause
          </Button>
        )}
        {canResume && (
          <Button
            variant="outline"
            size="sm"
            disabled={resume.isPending}
            onClick={() => resume.mutate(undefined, {
              onSuccess: () => toast.success("Subscription resumed"),
              onError: (e) => toast.error(getErrorMessage(e)),
            })}
          >
            Resume
          </Button>
        )}
        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            disabled={cancel.isPending}
            onClick={() =>
              cancel.mutate(
                { cancelAtPeriodEnd: true },
                {
                  onSuccess: () => toast.success("Subscription canceled"),
                  onError: (e) => toast.error(getErrorMessage(e)),
                }
              )
            }
          >
            Cancel at period end
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={portalToken.isPending}
          onClick={handlePortalLink}
        >
          Send portal link
        </Button>
      </CardContent>

      {(checkoutUrl || portalUrl) && (
        <CardContent className="space-y-3 border-t pt-4">
          {checkoutUrl && (
            <div className="space-y-2">
              <Label>Checkout URL</Label>
              <div className="flex gap-2">
                <Input value={checkoutUrl} readOnly className="font-mono text-xs" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(checkoutUrl).then(() => toast.success("Copied"))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {portalUrl && (
            <div className="space-y-2">
              <Label>Portal URL</Label>
              <Input value={portalUrl} readOnly className="font-mono text-xs" />
            </div>
          )}
        </CardContent>
      )}

      {subscription.state === "active" && plans.length > 0 && (
        <CardContent className="space-y-2 border-t pt-4">
          <Label>Upgrade plan</Label>
          <div className="flex gap-2">
            <select
              value={upgradePlanId}
              onChange={(e) => setUpgradePlanId(e.target.value)}
              className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="">Select plan</option>
              {plans
                .filter((p) => p.id !== subscription.planId)
                .map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              disabled={!upgradePlanId || upgrade.isPending}
              onClick={() =>
                upgrade.mutate(upgradePlanId, {
                  onSuccess: () => toast.success("Subscription upgraded"),
                  onError: (e) => toast.error(getErrorMessage(e)),
                })
              }
            >
              Upgrade
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
