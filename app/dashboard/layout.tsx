import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PendingNombaWebhookPrompt } from "@/components/dashboard/PendingNombaWebhookPrompt";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardShell>{children}</DashboardShell>
      <PendingNombaWebhookPrompt />
    </>
  );
}
