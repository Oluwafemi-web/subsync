import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Your subscription business at a glance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["MRR", "Active subscribers", "Churn rate", "Dunning recovery"].map(
          (title) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-muted-foreground/40">
                  —
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Coming in step 4
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
