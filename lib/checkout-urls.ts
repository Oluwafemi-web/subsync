export function getCheckoutRedirectUrls(): {
  successUrl: string;
  cancelUrl: string;
} {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  return {
    successUrl: `${origin}/dashboard/subscriptions`,
    cancelUrl: `${origin}/dashboard/subscriptions`,
  };
}
