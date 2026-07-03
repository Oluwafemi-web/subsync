import { CustomerDetailContent } from "@/components/dashboard/Customers/CustomerDetailContent";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerDetailContent customerId={id} />;
}
