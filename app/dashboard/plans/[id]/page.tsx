import { PlanDetailContent } from "@/components/dashboard/Plans/PlanDetailContent";

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlanDetailContent planId={id} />;
}
