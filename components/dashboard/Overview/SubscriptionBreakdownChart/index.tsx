"use client";

import { Loader2 } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TSubscriptionState } from "@/types";
import type { ISubscriptionBreakdownChartProps } from "./@types";

const STATE_COLORS: Record<TSubscriptionState, string> = {
  incomplete: "var(--chart-3)",
  active: "var(--chart-1)",
  trialing: "var(--chart-2)",
  past_due: "var(--chart-3)",
  paused: "var(--chart-4)",
  canceled: "var(--chart-5)",
  expired: "var(--chart-5)",
};

const STATE_LABELS: Record<TSubscriptionState, string> = {
  incomplete: "Pending payment",
  active: "Active",
  trialing: "Trialing",
  past_due: "Past due",
  paused: "Paused",
  canceled: "Canceled",
  expired: "Expired",
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { state: TSubscriptionState; count: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const { state, count } = payload[0].payload;

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-sm font-medium">{STATE_LABELS[state]}</p>
      <p className="text-xs text-muted-foreground">{count} subscriptions</p>
    </div>
  );
}

export function SubscriptionBreakdownChart({
  data,
  isLoading,
}: ISubscriptionBreakdownChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Subscription breakdown
        </CardTitle>
        <p className="text-xs text-muted-foreground">{total} total</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="state"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.state}
                      fill={STATE_COLORS[entry.state]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
              {data.map((item) => (
                <div key={item.state} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: STATE_COLORS[item.state] }}
                  />
                  <span className="text-muted-foreground">
                    {STATE_LABELS[item.state]}
                  </span>
                  <span className="ml-auto font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
