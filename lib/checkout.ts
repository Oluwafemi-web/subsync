export function getCheckoutRedirectUrls() {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  return {
    successUrl: `${origin}/dashboard/subscriptions`,
    cancelUrl: `${origin}/dashboard/subscriptions`,
  };
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
