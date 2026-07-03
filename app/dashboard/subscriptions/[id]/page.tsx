import { SubscriptionDetailContent } from "@/components/dashboard/Subscriptions/SubscriptionDetailContent";

export default async function SubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SubscriptionDetailContent subscriptionId={id} />;
}
