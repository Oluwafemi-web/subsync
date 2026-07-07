export const PENDING_API_KEY_STORAGE = "subsync_pending_api_key";
export const PENDING_NOMBA_WEBHOOK_URL_KEY = "subsync_nomba_webhook_url";
const NOMBA_WEBHOOK_SEEN_PREFIX = "subsync_nomba_webhook_seen";

export function setPendingApiKey(apiKey: string): void {
  sessionStorage.setItem(PENDING_API_KEY_STORAGE, apiKey);
}

export function setPendingNombaWebhookUrl(webhookUrl: string): void {
  if (!webhookUrl.trim()) {
    return;
  }

  sessionStorage.setItem(PENDING_NOMBA_WEBHOOK_URL_KEY, webhookUrl);
}

export function consumePendingNombaWebhookUrl(): string | null {
  const webhookUrl = sessionStorage.getItem(PENDING_NOMBA_WEBHOOK_URL_KEY);

  if (!webhookUrl) {
    return null;
  }

  sessionStorage.removeItem(PENDING_NOMBA_WEBHOOK_URL_KEY);
  return webhookUrl;
}

export function hasSeenNombaWebhookPrompt(userId: string): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return (
    localStorage.getItem(`${NOMBA_WEBHOOK_SEEN_PREFIX}_${userId}`) === "1"
  );
}

export function markNombaWebhookPromptSeen(userId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(`${NOMBA_WEBHOOK_SEEN_PREFIX}_${userId}`, "1");
}
